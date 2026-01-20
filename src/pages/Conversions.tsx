import { Scale } from "lucide-react";
const conversions = [{
  category: "Líquidos",
  items: [{
    from: "1 xícara",
    to: "240 ml"
  }, {
    from: "1/2 xícara",
    to: "120 ml"
  }, {
    from: "1/4 xícara",
    to: "60 ml"
  }, {
    from: "1 colher de sopa",
    to: "15 ml"
  }, {
    from: "1 colher de chá",
    to: "5 ml"
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
    from: "1/4 xícara",
    to: "30 g"
  }]
}, {
  category: "Açúcar",
  items: [{
    from: "1 xícara",
    to: "200 g"
  }, {
    from: "1/2 xícara",
    to: "100 g"
  }, {
    from: "1/4 xícara",
    to: "50 g"
  }]
}, {
  category: "Manteiga",
  items: [{
    from: "1 xícara",
    to: "225 g"
  }, {
    from: "1/2 xícara",
    to: "115 g"
  }, {
    from: "1 colher de sopa",
    to: "14 g"
  }]
}, {
  category: "Temperaturas do Forno",
  items: [{
    from: "Baixo",
    to: "150°C / 300°F"
  }, {
    from: "Moderado",
    to: "180°C / 350°F"
  }, {
    from: "Alto",
    to: "200°C / 400°F"
  }, {
    from: "Muito Alto",
    to: "220°C / 425°F"
  }]
}];
const Conversions = () => {
  return <div className="px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Scale className="w-6 h-6 text-foreground" />
        <h1 className="font-display text-4xl font-bold text-foreground">Conversão de medidas</h1>
      </div>

      <div className="space-y-6">
        {conversions.map(section => <div key={section.category} className="animate-fade-in">
            <h2 className="font-display text-2xl text-foreground mb-3">
              {section.category}
            </h2>
            <div className="bg-secondary rounded-lg overflow-hidden">
              {section.items.map((item, index) => <div key={index} className={`flex justify-between items-center px-4 py-3 ${index !== section.items.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-foreground font-body">{item.from}</span>
                  <span className="text-muted-foreground font-body">{item.to}</span>
                </div>)}
            </div>
          </div>)}
      </div>
    </div>;
};
export default Conversions;