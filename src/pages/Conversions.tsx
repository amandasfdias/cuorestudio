import { Scale, CookingPot, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
const tips = ["Para maior precisão da medição dos ingredientes secos, peneire sempre antes de medir e nunca comprima o ingrediente a ser medido.", "Para conferir a medição dos ingredientes líquidos, deve-se colocar o recipiente em uma superfície plana e verificar o nível na altura dos olhos.", "Para medir ingredientes em forma de gordura sólida, deve-se retirar o ingrediente da geladeira com antecedência para que sejam medidas em temperatura ambiente. Ao ser colocado no recipiente a ser medido, deve-se fazer uma pequena pressão para retirar o ar."];
const Conversions = () => {
  const navigate = useNavigate();
  return <div className="px-6 py-8 pb-24">
      <h1 className="font-display text-4xl font-bold text-foreground text-center mb-8">
        Conversão de medidas
      </h1>

      {/* Dicas */}
      <div className="mb-8">
        {tips.map((tip, index) => <div key={index}>
            <p className="text-base font-body text-[hsl(var(--terracotta))] leading-relaxed text-center">
              {tip}
            </p>
            {index < tips.length - 1 &&
        <div className="flex justify-center my-4">
                <span className="text-foreground text-lg">♥</span>
              </div>
        }
          </div>)}
      </div>

      {/* Botões de navegação */}
      <div className="flex justify-center gap-3 mb-8">
        <button onClick={() => navigate("/conversions/equivalencias")} className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-muted hover:bg-accent transition-colors">
          <Scale size={22} strokeWidth={1.5} className="text-[hsl(var(--terracotta))]" />
          <span className="font-handwritten text-sm text-foreground">Equivalências</span>
        </button>
        <button onClick={() => navigate("/conversions/medidas")} className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-muted hover:bg-accent transition-colors">
          <CookingPot size={22} strokeWidth={1.5} className="text-[hsl(var(--terracotta))]" />
          <span className="font-handwritten text-sm text-foreground">Medidas</span>
        </button>
        <button onClick={() => navigate("/conversions/calculadora")} className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-muted hover:bg-accent transition-colors">
          <Calculator size={22} strokeWidth={1.5} className="text-[hsl(var(--terracotta))]" />
          <span className="font-handwritten text-sm text-foreground">Calculadora</span>
        </button>
      </div>
    </div>;
};
export default Conversions;