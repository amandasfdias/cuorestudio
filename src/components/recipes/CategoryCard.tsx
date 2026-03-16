import { useRef } from "react";
import { ChefHat, Camera } from "lucide-react";
import { toast } from "sonner";

interface CategoryCardProps {
  name: string;
  image: string;
  count: number;
  onClick: () => void;
  onImageChange?: (file: File) => void;
  isUploading?: boolean;
}

const CategoryCard = ({ name, image, count, onClick, onImageChange, isUploading }: CategoryCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida");
      return;
    }
    onImageChange?.(file);
    e.target.value = "";
  };

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

      {/* Edit image button */}
      {onImageChange && (
        <>
          <button
            onClick={handleEditClick}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <Camera className="w-4 h-4 text-foreground" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

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
