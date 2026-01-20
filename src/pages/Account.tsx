import { User, Settings, Heart, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";

const Account = () => {
  const menuItems = [
    { icon: User, label: "Meu Perfil", action: () => {} },
    { icon: Heart, label: "Favoritas", action: () => {} },
    { icon: Settings, label: "Configurações", action: () => {} },
    { icon: LogOut, label: "Sair", action: () => {}, destructive: true },
  ];

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-4xl font-bold text-foreground mb-8">
        Minha Conta
      </h1>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4 overflow-hidden">
          <img src={logo} alt="Cuore" className="w-16 h-auto" />
        </div>
        <h2 className="font-display text-2xl text-foreground">Chef Cuore</h2>
        <p className="text-muted-foreground font-body text-sm">
          Suas receitas: 0
        </p>
      </div>

      <div className="bg-secondary rounded-lg overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  item.destructive ? "text-destructive" : "text-foreground"
                }`}
              />
              <span
                className={`font-body ${
                  item.destructive ? "text-destructive" : "text-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Account;
