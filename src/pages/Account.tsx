import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Heart, LogOut, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useRecipes, useFavoriteRecipes } from "@/hooks/useRecipes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import EditProfileModal from "@/components/account/EditProfileModal";
import logo from "@/assets/logo.png";

const Account = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: recipes } = useRecipes();
  const { data: favorites } = useFavoriteRecipes();
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const username = user?.email?.split("@")[0] || "usuario";

  const menuItems = [
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

      {/* Profile Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="relative">
          <Avatar className="w-20 h-20">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt="Avatar" />
            ) : (
              <AvatarFallback className="bg-secondary">
                <img src={logo} alt="Cuore" className="w-10 h-auto" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl text-foreground">
              {profile?.display_name || username}
            </h2>
            <button
              onClick={() => setEditModalOpen(true)}
              className="p-1.5 rounded-full hover:bg-secondary transition-colors"
              aria-label="Editar perfil"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-muted-foreground font-body text-sm">@{username}</p>
          <p className="text-muted-foreground font-body text-xs mt-1">
            {recipes?.length || 0} receitas
          </p>
        </div>
      </div>

      {/* Menu Items */}
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

      <EditProfileModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        profile={profile}
        userEmail={user?.email}
      />
    </div>
  );
};

export default Account;
