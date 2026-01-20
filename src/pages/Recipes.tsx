import { BookOpen } from "lucide-react";

const Recipes = () => {
  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-4xl font-bold text-foreground mb-6">
        Minhas Receitas
      </h1>
      
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl text-foreground mb-2">
          Nenhuma receita ainda
        </h2>
        <p className="text-muted-foreground font-body text-sm max-w-xs">
          Toque no botão + para adicionar sua primeira receita
        </p>
      </div>
    </div>
  );
};

export default Recipes;
