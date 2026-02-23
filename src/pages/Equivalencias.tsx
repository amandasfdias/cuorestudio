import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const equivalencias = [
  { from: "1 copo tipo 'requeijão'", to: "250 ml" },
  { from: "1 copo americano", to: "200 ml" },
  { from: "1 cálice de vinho", to: "100 ml" },
  { from: "1 xícara", to: "16 colheres (sopa) / 240 ml" },
  { from: "3/4 xícara", to: "12 colheres (sopa) / 180 ml" },
  { from: "2/3 xícara", to: "10 colheres (sopa) + 2 colheres (chá) / 160 ml" },
  { from: "1/2 xícara", to: "8 colheres (sopa) / 120 ml" },
  { from: "1/3 xícara", to: "5 colheres (sopa) + 1 colher (chá) / 80 ml" },
  { from: "1/4 xícara", to: "4 colheres (sopa) / 60 ml" },
  { from: "1 colher (sopa)", to: "15 ml" },
  { from: "1 colher (sobremesa)", to: "7,5 ml" },
  { from: "1 colher (chá)", to: "5 ml" },
  { from: "1 colher (café)", to: "2,5 ml" },
];

const Equivalencias = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-8 pb-24">
      <button
        onClick={() => navigate("/conversions")}
        className="flex items-center gap-1 text-muted-foreground mb-4"
      >
        <ArrowLeft size={18} />
        <span className="font-body text-sm">Voltar</span>
      </button>

      <h1 className="font-display text-4xl font-bold text-foreground text-center mb-8">
        Equivalências
      </h1>

      <div className="bg-secondary rounded-lg overflow-hidden animate-fade-in">
        {equivalencias.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between items-center px-4 py-3 ${
              index !== equivalencias.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-foreground font-body">{item.from}</span>
            <span className="text-muted-foreground font-body text-right">
              {item.to}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equivalencias;
