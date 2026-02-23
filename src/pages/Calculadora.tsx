import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ingredientes: Record<string, { xicara: number; colher: number }> = {
  "Líquido (Água, Suco, Leite, Óleo)": { xicara: 240, colher: 15 },
  "Manteiga / Gordura Vegetal": { xicara: 200, colher: 20 },
  "Mel / Glucose / Melado": { xicara: 300, colher: 18 },
  "Farinha de Trigo": { xicara: 120, colher: 7.5 },
  "Amido de Milho": { xicara: 150, colher: 9 },
  "Chocolate em Pó / Cacau em Pó": { xicara: 90, colher: 6 },
  "Açúcar Refinado": { xicara: 180, colher: 12 },
  "Açúcar Cristal": { xicara: 200, colher: 14 },
  "Açúcar de Confeiteiro": { xicara: 140, colher: 10 },
  "Açúcar Mascavo": { xicara: 150, colher: 11 },
  "Oleaginosas (Nozes, Castanhas...)": { xicara: 140, colher: 10 },
  "Fermento Químico / Bicarbonato": { xicara: 0, colher: 14 },
};

const Calculadora = () => {
  const navigate = useNavigate();
  const [ingrediente, setIngrediente] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("");

  const calcularGramas = () => {
    if (!ingrediente || !quantidade || !unidade) return null;
    const dados = ingredientes[ingrediente];
    if (!dados) return null;
    const fator = unidade === "xicara" ? dados.xicara : dados.colher;
    if (fator === 0) return null;
    const resultado = parseFloat(quantidade) * fator;
    return isNaN(resultado) ? null : resultado;
  };

  const resultado = calcularGramas();

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
        Calculadora
      </h1>

      <div className="space-y-5">
        {/* Ingrediente */}
        <div>
          <label className="font-body text-sm text-muted-foreground mb-1.5 block">Ingrediente</label>
          <Select value={ingrediente} onValueChange={setIngrediente}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o ingrediente" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(ingredientes).map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantidade */}
        <div>
          <label className="font-body text-sm text-muted-foreground mb-1.5 block">Quantidade</label>
          <Input
            type="number"
            min="0"
            step="0.25"
            placeholder="Ex: 1, 0.5, 2"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>

        {/* Unidade */}
        <div>
          <label className="font-body text-sm text-muted-foreground mb-1.5 block">Unidade</label>
          <Select value={unidade} onValueChange={setUnidade}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xicara">Xícara</SelectItem>
              <SelectItem value="colher">Colher (sopa)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resultado */}
        {resultado !== null && (
          <div className="mt-6 p-5 bg-secondary rounded-xl text-center animate-fade-in">
            <span className="font-body text-sm text-muted-foreground block mb-1">Resultado</span>
            <span className="font-display text-3xl font-bold text-[hsl(var(--terracotta))]">
              {resultado % 1 === 0 ? resultado : resultado.toFixed(1)} g
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculadora;
