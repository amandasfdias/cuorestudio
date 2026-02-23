from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import httpx
from bs4 import BeautifulSoup
import re
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class Ingredient(BaseModel):
    name: str
    quantity: str = ""
    unit: str = ""

class Recipe(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    ingredients: List[Ingredient] = []
    instructions: List[str] = []
    servings: str = ""
    prep_time: str = ""
    cook_time: str = ""
    image_base64: Optional[str] = None
    source_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RecipeCreate(BaseModel):
    title: str
    description: str = ""
    ingredients: List[Ingredient] = []
    instructions: List[str] = []
    servings: str = ""
    prep_time: str = ""
    cook_time: str = ""
    image_base64: Optional[str] = None
    source_url: Optional[str] = None

class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[List[Ingredient]] = None
    instructions: Optional[List[str]] = None
    servings: Optional[str] = None
    prep_time: Optional[str] = None
    cook_time: Optional[str] = None
    image_base64: Optional[str] = None

class URLRequest(BaseModel):
    url: str

class ImageRequest(BaseModel):
    image_base64: str

# Helper function for OCR
async def extract_recipe_from_image(image_base64: str) -> dict:
    from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
    
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="LLM API key not configured")
    
    chat = LlmChat(
        api_key=api_key,
        session_id=f"recipe-ocr-{uuid.uuid4()}",
        system_message="""You are a recipe extraction assistant. Extract recipe information from images.
Always respond in valid JSON format with the following structure:
{
    "title": "Recipe title",
    "description": "Brief description",
    "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "unit"}],
    "instructions": ["step 1", "step 2"],
    "servings": "number of servings",
    "prep_time": "preparation time",
    "cook_time": "cooking time"
}
If you cannot identify certain fields, leave them empty or with reasonable defaults."""
    ).with_model("openai", "gpt-4o")
    
    # Clean base64 string
    if ',' in image_base64:
        image_base64 = image_base64.split(',')[1]
    
    image_content = ImageContent(image_base64=image_base64)
    
    user_message = UserMessage(
        text="Please extract the recipe information from this image. Return ONLY valid JSON.",
        image_contents=[image_content]
    )
    
    response = await chat.send_message(user_message)
    
    # Parse the JSON response
    import json
    try:
        # Clean up response - remove markdown code blocks if present
        clean_response = response.strip()
        if clean_response.startswith('```'):
            clean_response = re.sub(r'^```json?\s*', '', clean_response)
            clean_response = re.sub(r'\s*```$', '', clean_response)
        return json.loads(clean_response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse LLM response: {response}")
        return {
            "title": "Extracted Recipe",
            "description": response[:200] if response else "",
            "ingredients": [],
            "instructions": [response] if response else [],
            "servings": "",
            "prep_time": "",
            "cook_time": ""
        }

# Helper function for URL extraction
async def extract_recipe_from_url(url: str) -> dict:
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
            response = await client.get(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            response.raise_for_status()
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try to find recipe data in JSON-LD
        import json
        for script in soup.find_all('script', type='application/ld+json'):
            try:
                data = json.loads(script.string)
                if isinstance(data, list):
                    data = data[0]
                if data.get('@type') == 'Recipe' or (isinstance(data.get('@graph'), list)):
                    if '@graph' in data:
                        for item in data['@graph']:
                            if item.get('@type') == 'Recipe':
                                data = item
                                break
                    
                    ingredients = []
                    for ing in data.get('recipeIngredient', []):
                        ingredients.append({"name": ing, "quantity": "", "unit": ""})
                    
                    instructions = []
                    inst_data = data.get('recipeInstructions', [])
                    if isinstance(inst_data, list):
                        for inst in inst_data:
                            if isinstance(inst, str):
                                instructions.append(inst)
                            elif isinstance(inst, dict):
                                instructions.append(inst.get('text', str(inst)))
                    
                    return {
                        "title": data.get('name', 'Untitled Recipe'),
                        "description": data.get('description', ''),
                        "ingredients": ingredients,
                        "instructions": instructions,
                        "servings": str(data.get('recipeYield', '')),
                        "prep_time": data.get('prepTime', ''),
                        "cook_time": data.get('cookTime', ''),
                    }
            except (json.JSONDecodeError, TypeError):
                continue
        
        # Fallback: basic extraction
        title = soup.find('h1')
        title_text = title.get_text().strip() if title else "Recipe from URL"
        
        return {
            "title": title_text,
            "description": f"Recipe imported from {url}",
            "ingredients": [],
            "instructions": [],
            "servings": "",
            "prep_time": "",
            "cook_time": ""
        }
        
    except Exception as e:
        logger.error(f"Error extracting recipe from URL: {e}")
        raise HTTPException(status_code=400, detail=f"Could not extract recipe from URL: {str(e)}")

# Routes
@api_router.get("/")
async def root():
    return {"message": "Recipe App API"}

@api_router.get("/recipes", response_model=List[Recipe])
async def get_recipes():
    recipes = await db.recipes.find().sort("created_at", -1).to_list(1000)
    return [Recipe(**recipe) for recipe in recipes]

@api_router.get("/recipes/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: str):
    recipe = await db.recipes.find_one({"id": recipe_id})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return Recipe(**recipe)

@api_router.post("/recipes", response_model=Recipe)
async def create_recipe(recipe_data: RecipeCreate):
    recipe = Recipe(**recipe_data.dict())
    await db.recipes.insert_one(recipe.dict())
    return recipe

@api_router.put("/recipes/{recipe_id}", response_model=Recipe)
async def update_recipe(recipe_id: str, recipe_data: RecipeUpdate):
    existing = await db.recipes.find_one({"id": recipe_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    update_dict = {k: v for k, v in recipe_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    await db.recipes.update_one({"id": recipe_id}, {"$set": update_dict})
    updated = await db.recipes.find_one({"id": recipe_id})
    return Recipe(**updated)

@api_router.delete("/recipes/{recipe_id}")
async def delete_recipe(recipe_id: str):
    result = await db.recipes.delete_one({"id": recipe_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {"message": "Recipe deleted successfully"}

@api_router.post("/recipes/from-url", response_model=Recipe)
async def create_recipe_from_url(request: URLRequest):
    recipe_data = await extract_recipe_from_url(request.url)
    recipe_data["source_url"] = request.url
    recipe = Recipe(**recipe_data)
    await db.recipes.insert_one(recipe.dict())
    return recipe

@api_router.post("/recipes/from-image", response_model=Recipe)
async def create_recipe_from_image(request: ImageRequest):
    recipe_data = await extract_recipe_from_image(request.image_base64)
    recipe_data["image_base64"] = request.image_base64
    recipe = Recipe(**recipe_data)
    await db.recipes.insert_one(recipe.dict())
    return recipe

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
