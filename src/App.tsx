import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import Conversions from "./pages/Conversions";
import Account from "./pages/Account";
import AddRecipeUrl from "./pages/AddRecipeUrl";
import AddRecipeManual from "./pages/AddRecipeManual";
import AddRecipeScan from "./pages/AddRecipeScan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/conversions" element={<Conversions />} />
            <Route path="/account" element={<Account />} />
            <Route path="/add-recipe/url" element={<AddRecipeUrl />} />
            <Route path="/add-recipe/manual" element={<AddRecipeManual />} />
            <Route path="/add-recipe/scan" element={<AddRecipeScan />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
