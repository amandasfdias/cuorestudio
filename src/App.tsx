import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import EditRecipe from "./pages/EditRecipe";
import Conversions from "./pages/Conversions";
import Equivalencias from "./pages/Equivalencias";
import Medidas from "./pages/Medidas";
import Calculadora from "./pages/Calculadora";
import Account from "./pages/Account";
import Favorites from "./pages/Favorites";
import AddRecipeUrl from "./pages/AddRecipeUrl";
import AddRecipeManual from "./pages/AddRecipeManual";
import AddRecipeScan from "./pages/AddRecipeScan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <TooltipProvider>
            <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/recipe/:id/edit" element={<EditRecipe />} />
                <Route path="/conversions" element={<Conversions />} />
                <Route path="/conversions/equivalencias" element={<Equivalencias />} />
                <Route path="/conversions/medidas" element={<Medidas />} />
                <Route path="/conversions/calculadora" element={<Calculadora />} />
                <Route path="/account" element={<Account />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/add-recipe/url" element={<AddRecipeUrl />} />
                <Route path="/add-recipe/manual" element={<AddRecipeManual />} />
                <Route path="/add-recipe/scan" element={<AddRecipeScan />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
            </BrowserRouter>
          </TooltipProvider>
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
