import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Palette, Settings, Heart, LogOut, ChevronRight, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useFavoriteRecipes } from "@/hooks/useRecipes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import EditProfileModal from "@/components/account/EditProfileModal";
import AppearanceModal from "@/components/account/AppearanceModal";
import SettingsModal from "@/components/account/SettingsModal";
import logo from "@/assets/logo.png";

const Account = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: favorites } = useFavoriteRecipes();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [appearanceModalOpen, setAppearanceModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const displayUsername = profile?.username || user?.email?.split("@")[0] || "usuario";

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
    <div className="px-6 py-8 pb-24">
      <h1 className="font-display text-4xl font-bold text-foreground mb-8">
        Minha Conta
      </h1>

      {/* Profile Header */}
      <div className="flex items-start gap-4 mb-8">
        <button
          onClick={() => setEditModalOpen(true)}
          className="relative group"
          aria-label="Alterar foto de perfil"
        >
          <Avatar className="w-20 h-20">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt="Avatar" />
            ) : (
              <AvatarFallback className="bg-secondary">
                <img src={logo} alt="Cuore" className="w-10 h-auto" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </button>

        <div className="flex-1">
          <h2 className="font-display text-2xl text-foreground">
            {profile?.display_name || displayUsername}
          </h2>
          <p className="text-muted-foreground font-body text-sm">@{displayUsername}</p>
        </div>
      </div>

      {/* Main Menu */}
      <div className="bg-secondary rounded-lg overflow-hidden mb-4">
        <button
          onClick={() => setEditModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left border-b border-border"
        >
          <User className="w-5 h-5 text-foreground" />
          <span className="font-body text-foreground flex-1">Dados da Conta</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => setAppearanceModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left border-b border-border"
        >
          <Palette className="w-5 h-5 text-foreground" />
          <span className="font-body text-foreground flex-1">Aparência</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => setSettingsModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left"
        >
          <Settings className="w-5 h-5 text-foreground" />
          <span className="font-body text-foreground flex-1">Configurações</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Secondary Menu */}
      <div className="bg-secondary rounded-lg overflow-hidden mb-4">
        <button
          onClick={() => navigate("/favorites")}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left"
        >
          <Heart className="w-5 h-5 text-foreground" />
          <span className="font-body text-foreground flex-1">Favoritas ({favorites?.length || 0})</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Logout */}
      <div className="bg-secondary rounded-lg overflow-hidden">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left"
        >
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="font-body text-destructive">Sair</span>
        </button>
      </div>

      <EditProfileModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        profile={profile}
        userEmail={user?.email}
      />

      <AppearanceModal
        open={appearanceModalOpen}
        onOpenChange={setAppearanceModalOpen}
      />

      <SettingsModal
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
      />
    </div>
  );
};

export default Account;
