import { Scale, CookingPot, Calculator } from "lucide-react";
const conversions = [{
  category: "Equivalências",
  items: [{
    from: "1 copo tipo 'requeijão'",
    to: "250 ml"
  }, {
    from: "1 copo americano",
    to: "200 ml"
  }, {
    from: "1 cálice de vinho",
    to: "100 ml"
  }, {
    from: "1 xícara",
    to: "16 colheres (sopa) / 240 ml"
  }, {
    from: "3/4 xícara",
    to: "12 colheres (sopa) / 180 ml"
  }, {
    from: "2/3 xícara",
    to: "10 colheres (sopa) + 2 colheres (chá) / 160 ml"
  }, {
    from: "1/2 xícara",
    to: "8 colheres (sopa) / 120 ml"
  }, {
    from: "1/3 xícara",
    to: "5 colheres (sopa) + 1 colher (chá) / 80 ml"
  }, {
    from: "1/4 xícara",
    to: "4 colheres (sopa) / 60 ml"
  }, {
    from: "1 colher (sopa)",
    to: "15 ml"
  }, {
    from: "1 colher (sobremesa)",
    to: "7,5 ml"
  }, {
    from: "1 colher (chá)",
    to: "5 ml"
  }, {
    from: "1 colher (café)",
    to: "2,5 ml"
  }]
}, {
  category: "Líquido (Água, Suco, Leite, Buttermilk, Café, Óleo)",
  items: [{
    from: "1 xícara",
    to: "240 ml"
  }, {
    from: "1/2 xícara",
    to: "120 ml"
  }, {
    from: "1/3 xícara",
    to: "80 ml"
  }, {
    from: "1/4 xícara",
    to: "60 ml"
  }, {
    from: "1 colher (sopa)",
    to: "15 ml"
  }]
}, {
  category: "Manteiga / Gordura Vegetal",
  items: [{
    from: "1 xícara",
    to: "200 g"
  }, {
    from: "1/2 xícara",
    to: "100 g"
  }, {
    from: "1/3 xícara",
    to: "67 g"
  }, {
    from: "1/4 xícara",
    to: "50 g"
  }, {
    from: "1 colher (sopa)",
    to: "20 g"
  }]
}, {
  category: "Mel / Glucose / Melado",
  items: [{
    from: "1 xícara",
    to: "300 g"
  }, {
    from: "1/2 xícara",
    to: "150 g"
  }, {
    from: "1/3 xícara",
    to: "100 g"
  }, {
    from: "1/4 xícara",
    to: "75 g"
  }, {
    from: "1 colher (sopa)",
    to: "18 g"
  }]
}, {
  category: "Farinha de Trigo",
  items: [{
    from: "1 xícara",
    to: "120 g"
  }, {
    from: "1/2 xícara",
    to: "60 g"
  }, {
    from: "1/3 xícara",
    to: "40 g"
  }, {
    from: "1/4 xícara",
    to: "30 g"
  }, {
    from: "1 colher (sopa)",
    to: "7,5 g"
  }]
}, {
  category: "Amido de Milho",
  items: [{
    from: "1 xícara",
    to: "150 g"
  }, {
    from: "1/2 xícara",
    to: "75 g"
  }, {
    from: "1/3 xícara",
    to: "50 g"
  }, {
    from: "1/4 xícara",
    to: "38 g"
  }, {
    from: "1 colher (sopa)",
    to: "9 g"
  }]
}, {
  category: "Chocolate em Pó / Cacau em Pó",
  items: [{
    from: "1 xícara",
    to: "90 g"
  }, {
    from: "1/2 xícara",
    to: "45 g"
  }, {
    from: "1/3 xícara",
    to: "30 g"
  }, {
    from: "1/4 xícara",
    to: "23 g"
  }, {
    from: "1 colher (sopa)",
    to: "6 g"
  }]
}, {
  category: "Açúcar Refinado",
  items: [{
    from: "1 xícara",
    to: "180 g"
  }, {
    from: "1/2 xícara",
    to: "90 g"
  }, {
    from: "1/3 xícara",
    to: "60 g"
  }, {
    from: "1/4 xícara",
    to: "45 g"
  }, {
    from: "1 colher (sopa)",
    to: "12 g"
  }]
}, {
  category: "Açúcar Cristal",
  items: [{
    from: "1 xícara",
    to: "200 g"
  }, {
    from: "1/2 xícara",
    to: "100 g"
  }, {
    from: "1/3 xícara",
    to: "67 g"
  }, {
    from: "1/4 xícara",
    to: "50 g"
  }, {
    from: "1 colher (sopa)",
    to: "14 g"
  }]
}, {
  category: "Açúcar de Confeiteiro",
  items: [{
    from: "1 xícara",
    to: "140 g"
  }, {
    from: "1/2 xícara",
    to: "70 g"
  }, {
    from: "1/3 xícara",
    to: "37 g"
  }, {
    from: "1/4 xícara",
    to: "35 g"
  }, {
    from: "1 colher (sopa)",
    to: "10 g"
  }]
}, {
  category: "Açúcar Mascavo",
  items: [{
    from: "1 xícara",
    to: "150 g"
  }, {
    from: "1/2 xícara",
    to: "75 g"
  }, {
    from: "1/3 xícara",
    to: "50 g"
  }, {
    from: "1/4 xícara",
    to: "38 g"
  }, {
    from: "1 colher (sopa)",
    to: "11 g"
  }]
}, {
  category: "Oleaginosas (Nozes, Castanhas...)",
  items: [{
    from: "1 xícara",
    to: "140 g"
  }, {
    from: "1/2 xícara",
    to: "70 g"
  }, {
    from: "1/3 xícara",
    to: "47 g"
  }, {
    from: "1/4 xícara",
    to: "35 g"
  }, {
    from: "1 colher (sopa)",
    to: "10 g"
  }]
}, {
  category: "Fermento Químico em Pó / Bicarbonato de Sódio",
  items: [{
    from: "1 colher (sopa)",
    to: "14 g"
  }, {
    from: "1 colher (chá)",
    to: "5 g"
  }]
}, {
  category: "Fermento Biológico Seco / Fresco",
  items: [{
    from: "1 tablete (15g) fermento fresco",
    to: "1/2 colher de sopa (5g) fermento seco"
  }]
}];
const tips = ["Para maior precisão da medição dos ingredientes secos, peneire sempre antes de medir e nunca comprima o ingrediente a ser medido.", "Para conferir a medição dos ingredientes líquidos, deve-se colocar o recipiente em uma superfície plana e verificar o nível na altura dos olhos.", "Para medir ingredientes em forma de gordura sólida, deve-se retirar o ingrediente da geladeira com antecedência para que sejam medidas em temperatura ambiente. Ao ser colocado no recipiente a ser medido, deve-se fazer uma pequena pressão para retirar o ar."];
const Conversions = () => {
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
        <button className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-muted hover:bg-accent transition-colors">
          <Scale size={22} strokeWidth={1.5} className="text-[hsl(var(--terracotta))]" />
          <span className="font-handwritten text-sm text-foreground">Equivalências</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-muted hover:bg-accent transition-colors">
          <CookingPot size={22} strokeWidth={1.5} className="text-[hsl(var(--terracotta))]" />
          <span className="font-handwritten text-sm text-foreground">Medidas</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-muted hover:bg-accent transition-colors">
          <Calculator size={22} strokeWidth={1.5} className="text-[hsl(var(--terracotta))]" />
          <span className="font-handwritten text-sm text-foreground">Calculadora</span>
        </button>
      </div>

      <div className="space-y-6">
        {conversions.map((section) => <div key={section.category} className="animate-fade-in">
            <h2 className="font-display text-2xl text-foreground mb-3">
              {section.category}
            </h2>
            <div className="bg-secondary rounded-lg overflow-hidden">
              {section.items.map((item, index) => <div key={index} className={`flex justify-between items-center px-4 py-3 ${index !== section.items.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-foreground font-body">{item.from}</span>
                  <span className="text-muted-foreground font-body text-right">
                    {item.to}
                  </span>
                </div>)}
            </div>
          </div>)}
      </div>
    </div>;
};
export default Conversions;