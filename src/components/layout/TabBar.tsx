import { Home, BookOpen, Plus, Scale, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AddRecipeModal from "../recipes/AddRecipeModal";

const TabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Don't show tab bar on auth page
  if (location.pathname === "/auth") {
    return null;
  }

  const tabs = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/recipes", icon: BookOpen, label: "Receitas" },
    { path: "add", icon: Plus, label: "Adicionar", isAction: true },
    { path: "/conversions", icon: Scale, label: "Medidas" },
    { path: "/account", icon: User, label: "Conta" },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.isAction) {
      if (user) {
        setIsAddModalOpen(true);
      } else {
        navigate("/auth");
      }
    } else {
      navigate(tab.path);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-0 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] z-50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {tabs.map((tab) => {
            const isActive = !tab.isAction && location.pathname === tab.path;
            const Icon = tab.icon;

            if (tab.isAction) {
              return (
                <button
                  key={tab.path}
                  onClick={() => handleTabClick(tab)}
                  className="flex flex-col items-center justify-center -mt-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform active:scale-95">
                    <Icon className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={tab.path}
                onClick={() => handleTabClick(tab)}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors"
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-[hsl(var(--tab-active))]" : "text-foreground"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-xs font-body transition-colors ${
                    isActive ? "text-[hsl(var(--tab-active))] font-medium" : "text-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <AddRecipeModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </>
  );
};

export default TabBar;
