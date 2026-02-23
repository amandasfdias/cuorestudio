import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const medidas = [
  {
    category: "Líquido (Água, Suco, Leite, Buttermilk, Café, Óleo)",
    items: [
      { from: "1 xícara", to: "240 ml" },
      { from: "1/2 xícara", to: "120 ml" },
      { from: "1/3 xícara", to: "80 ml" },
      { from: "1/4 xícara", to: "60 ml" },
      { from: "1 colher (sopa)", to: "15 ml" },
    ],
  },
  {
    category: "Manteiga / Gordura Vegetal",
    items: [
      { from: "1 xícara", to: "200 g" },
      { from: "1/2 xícara", to: "100 g" },
      { from: "1/3 xícara", to: "67 g" },
      { from: "1/4 xícara", to: "50 g" },
      { from: "1 colher (sopa)", to: "20 g" },
    ],
  },
  {
    category: "Mel / Glucose / Melado",
    items: [
      { from: "1 xícara", to: "300 g" },
      { from: "1/2 xícara", to: "150 g" },
      { from: "1/3 xícara", to: "100 g" },
      { from: "1/4 xícara", to: "75 g" },
      { from: "1 colher (sopa)", to: "18 g" },
    ],
  },
  {
    category: "Farinha de Trigo",
    items: [
      { from: "1 xícara", to: "120 g" },
      { from: "1/2 xícara", to: "60 g" },
      { from: "1/3 xícara", to: "40 g" },
      { from: "1/4 xícara", to: "30 g" },
      { from: "1 colher (sopa)", to: "7,5 g" },
    ],
  },
  {
    category: "Amido de Milho",
    items: [
      { from: "1 xícara", to: "150 g" },
      { from: "1/2 xícara", to: "75 g" },
      { from: "1/3 xícara", to: "50 g" },
      { from: "1/4 xícara", to: "38 g" },
      { from: "1 colher (sopa)", to: "9 g" },
    ],
  },
  {
    category: "Chocolate em Pó / Cacau em Pó",
    items: [
      { from: "1 xícara", to: "90 g" },
      { from: "1/2 xícara", to: "45 g" },
      { from: "1/3 xícara", to: "30 g" },
      { from: "1/4 xícara", to: "23 g" },
      { from: "1 colher (sopa)", to: "6 g" },
    ],
  },
  {
    category: "Açúcar Refinado",
    items: [
      { from: "1 xícara", to: "180 g" },
      { from: "1/2 xícara", to: "90 g" },
      { from: "1/3 xícara", to: "60 g" },
      { from: "1/4 xícara", to: "45 g" },
      { from: "1 colher (sopa)", to: "12 g" },
    ],
  },
  {
    category: "Açúcar Cristal",
    items: [
      { from: "1 xícara", to: "200 g" },
      { from: "1/2 xícara", to: "100 g" },
      { from: "1/3 xícara", to: "67 g" },
      { from: "1/4 xícara", to: "50 g" },
      { from: "1 colher (sopa)", to: "14 g" },
    ],
  },
  {
    category: "Açúcar de Confeiteiro",
    items: [
      { from: "1 xícara", to: "140 g" },
      { from: "1/2 xícara", to: "70 g" },
      { from: "1/3 xícara", to: "37 g" },
      { from: "1/4 xícara", to: "35 g" },
      { from: "1 colher (sopa)", to: "10 g" },
    ],
  },
  {
    category: "Açúcar Mascavo",
    items: [
      { from: "1 xícara", to: "150 g" },
      { from: "1/2 xícara", to: "75 g" },
      { from: "1/3 xícara", to: "50 g" },
      { from: "1/4 xícara", to: "38 g" },
      { from: "1 colher (sopa)", to: "11 g" },
    ],
  },
  {
    category: "Oleaginosas (Nozes, Castanhas...)",
    items: [
      { from: "1 xícara", to: "140 g" },
      { from: "1/2 xícara", to: "70 g" },
      { from: "1/3 xícara", to: "47 g" },
      { from: "1/4 xícara", to: "35 g" },
      { from: "1 colher (sopa)", to: "10 g" },
    ],
  },
  {
    category: "Fermento Químico em Pó / Bicarbonato de Sódio",
    items: [
      { from: "1 colher (sopa)", to: "14 g" },
      { from: "1 colher (chá)", to: "5 g" },
    ],
  },
  {
    category: "Fermento Biológico Seco / Fresco",
    items: [
      { from: "1 tablete (15g) fermento fresco", to: "1/2 colher de sopa (5g) fermento seco" },
    ],
  },
];

const Medidas = () => {
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
        Medidas por ingrediente
      </h1>

      <div className="space-y-6">
        {medidas.map((section) => (
          <div key={section.category} className="animate-fade-in">
            <h2 className="font-display text-2xl text-foreground mb-3">
              {section.category}
            </h2>
            <div className="bg-secondary rounded-lg overflow-hidden">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center px-4 py-3 ${
                    index !== section.items.length - 1 ? "border-b border-border" : ""
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
        ))}
      </div>
    </div>
  );
};

export default Medidas;
