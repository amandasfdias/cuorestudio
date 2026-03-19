import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Palette, Settings, Heart, LogOut, ChevronRight, Camera, BookOpen, Shield, FileText, Info, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useRecipes, useFavoriteRecipes } from "@/hooks/useRecipes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import EditProfileModal from "@/components/account/EditProfileModal";
import AppearanceModal from "@/components/account/AppearanceModal";
import SettingsModal from "@/components/account/SettingsModal";
import logo from "@/assets/logo.png";

const Account = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: recipes } = useRecipes();
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
  const displayName = profile?.display_name || displayUsername;

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
      <h1 className="<h1 className="font-display text-4xl font-bold text-foreground text-center mb-6"> text-foreground text-center mb-6">
        Minha Conta
      </h1>

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setEditModalOpen(true)}
          className="relative group"
          aria-label="Alterar foto de perfil"
        >
          <div className="rounded-full p-[3px] border-2 border-primary/40">
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
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </button>

        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-foreground uppercase">
            {displayName}
          </h1>
          <p className="text-muted-foreground font-body text-sm">@{displayUsername}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => navigate("/recipes")}
          className="bg-secondary rounded-xl p-4 flex flex-col items-center gap-2 transition-colors hover:bg-accent"
        >
          <BookOpen className="w-6 h-6 text-foreground" />
          <span className="font-display text-2xl font-bold text-foreground">{recipes?.length || 0}</span>
          <span className="font-body text-sm text-muted-foreground">Receitas</span>
        </button>
        <button
          onClick={() => navigate("/favorites")}
          className="bg-secondary rounded-xl p-4 flex flex-col items-center gap-2 transition-colors hover:bg-accent"
        >
          <Heart className="w-6 h-6 text-foreground" />
          <span className="font-display text-2xl font-bold text-foreground">{favorites?.length || 0}</span>
          <span className="font-body text-sm text-muted-foreground">Favoritos</span>
        </button>
      </div>

      {/* Main Menu */}
      <div className="bg-card rounded-xl overflow-hidden mb-4 shadow-sm">
        <button
          onClick={() => setEditModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left border-b border-border"
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Conta</span>
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wide">Perfil, login e dados pessoais</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => setAppearanceModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left border-b border-border"
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Aparência</span>
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wide">Tema e cores do aplicativo</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => setSettingsModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left"
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Configurações</span>
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wide">Idioma e sistema de medidas</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Secondary Menu */}
      <div className="bg-card rounded-xl overflow-hidden mb-4 shadow-sm">
        <button
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left border-b border-border"
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Shield className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Política de Privacidade</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left border-b border-border"
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Termos e Condições</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left"
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Info className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Sobre</span>
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wide">Versão App 1.0</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Logout */}
      <div className="bg-card rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left"
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <span className="font-body text-destructive font-medium">Sair</span>
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
