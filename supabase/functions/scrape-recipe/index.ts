import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function extractRecipeWithAI(
  pageContent: string,
  lovableApiKey: string,
  sourceUrl?: string,
  imageUrl?: string | null
) {
  const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        {
          role: 'system',
          content: `Você é um especialista em extrair receitas. Analise o conteúdo fornecido e extraia as informações da receita em formato estruturado. 
            
Retorne APENAS um objeto JSON válido com os seguintes campos:
- title: nome da receita (string)
- ingredients: lista de ingredientes, um por linha (string com quebras de linha \\n)
- instructions: modo de preparo, um passo por linha (string com quebras de linha \\n)
- prep_time: tempo de preparo em minutos (número ou null)
- cook_time: tempo de cozimento em minutos (número ou null)
- servings: número de porções (número ou null)
- category: categoria da receita como "Sobremesa", "Prato Principal", "Entrada", etc (string ou null)

Se não conseguir identificar uma receita no conteúdo, retorne: {"error": "Não foi possível identificar uma receita neste texto"}

IMPORTANTE: Retorne APENAS o JSON, sem markdown, sem explicações.`
        },
        {
          role: 'user',
          content: `Extraia a receita do seguinte conteúdo:\n\n${pageContent.substring(0, 15000)}`
        }
      ],
      temperature: 0.1,
    }),
  });

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    console.error('AI API error:', aiResponse.status, errorText);
    
    let errorMsg = 'Erro ao processar a receita com IA';
    if (aiResponse.status === 429) errorMsg = 'Limite de requisições excedido. Tente novamente em alguns minutos.';
    if (aiResponse.status === 402) errorMsg = 'Créditos insuficientes. Por favor, adicione créditos na sua conta.';
    
    return { success: false, error: errorMsg };
  }

  const aiData = await aiResponse.json();
  const aiContent = aiData.choices?.[0]?.message?.content || '';

  console.log('AI response:', aiContent);

  let recipeData;
  try {
    let cleanContent = aiContent.trim();
    if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7);
    else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3);
    if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3);
    cleanContent = cleanContent.trim();
    
    recipeData = JSON.parse(cleanContent);
  } catch {
    return { success: false, error: 'Não foi possível extrair a receita deste conteúdo' };
  }

  if (recipeData.error) {
    return { success: false, error: recipeData.error };
  }

  if (sourceUrl) recipeData.source_url = sourceUrl;
  if (imageUrl) recipeData.image_url = imageUrl;

  return { success: true, data: recipeData };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, text } = await req.json();

    if (!url && !text) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL ou texto é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI não configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // MODE 1: Extract from pasted text directly
    if (text) {
      console.log('Extracting recipe from pasted text...');
      const result = await extractRecipeWithAI(text, lovableApiKey);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // MODE 2: Scrape URL then extract
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl não configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Scraping URL:', formattedUrl);

    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok || !scrapeData.success) {
      console.error('Firecrawl API error:', scrapeData);
      const firecrawlError = scrapeData.error || '';
      const isUnsupported = firecrawlError.includes('do not support this site');
      return new Response(
        JSON.stringify({
          success: false,
          unsupported: isUnsupported,
          error: isUnsupported
            ? 'Este site não é suportado para importação automática. Cole o texto da receita abaixo.'
            : 'Falha ao acessar a página. Verifique se a URL está correta.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pageContent = scrapeData.data?.markdown || '';
    const pageMetadata = scrapeData.data?.metadata || {};

    if (!pageContent) {
      return new Response(
        JSON.stringify({ success: false, error: 'Não foi possível extrair conteúdo da página' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Page scraped successfully, extracting recipe with AI...');

    const result = await extractRecipeWithAI(
      pageContent,
      lovableApiKey,
      formattedUrl,
      pageMetadata.ogImage || null
    );

    if (result.success) {
      console.log('Recipe extracted successfully:', result.data?.title);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error scraping recipe:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
