import { ChefHat } from "lucide-react";

interface CategoryCardProps {
  name: string;
  image: string;
  count: number;
  onClick: () => void;
}

const CategoryCard = ({ name, image, count, onClick }: CategoryCardProps) => {
  return (
    <button
      onClick={onClick}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden group animate-fade-in"
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-accent flex items-center justify-center">
          <ChefHat className="w-10 h-10 text-muted-foreground" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
        <h3 className="font-display text-2xl text-white drop-shadow-md">
          {name}
        </h3>
        <span className="text-white/80 text-xs font-body">
          {count} {count === 1 ? "receita" : "receitas"}
        </span>
      </div>
    </button>
  );
};

export default CategoryCard;
