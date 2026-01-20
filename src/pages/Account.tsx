import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useRecipes, useFavoriteRecipes } from "@/hooks/useRecipes";
import logo from "@/assets/logo.png";

const Account = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: recipes } = useRecipes();
  const { data: favorites } = useFavoriteRecipes();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const menuItems = [
    { icon: User, label: "Meu Perfil", action: () => navigate("/profile") },
    { icon: Heart, label: `Favoritas (${favorites?.length || 0})`, action: () => navigate("/favorites") },
    { icon: Settings, label: "Configurações", action: () => {} },
    { icon: LogOut, label: "Sair", action: handleSignOut, destructive: true },
  ];

  if (authLoading || profileLoading) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-4xl font-bold text-foreground mb-8">
        Minha Conta
      </h1>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4 overflow-hidden">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <img src={logo} alt="Cuore" className="w-16 h-auto" />
          )}
        </div>
        <h2 className="font-display text-2xl text-foreground">
          {profile?.display_name || user?.email?.split("@")[0] || "Chef Cuore"}
        </h2>
        <p className="text-muted-foreground font-body text-sm">
          Suas receitas: {recipes?.length || 0}
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
