import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Palette, Settings, Heart, LogOut, ChevronRight, Camera, BookOpen, Shield, FileText, Info } from "lucide-react";
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
      <h1 className="font-display text-4xl font-bold text-foreground text-center mb-6">
        Minha Conta
      </h1>

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setEditModalOpen(true)}
          className="relative group shrink-0"
          aria-label="Alterar foto de perfil"
        >
          <div className="rounded-full p-[3px] border-2 border-[hsl(var(--terracotta))]">
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

        <div className="flex-1 min-w-0">
          <h2 className="font-display text-3xl font-bold text-foreground uppercase leading-tight">
            {displayName}
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-2">@{displayUsername}</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/recipes")} className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="font-body text-sm font-semibold text-foreground">{recipes?.length || 0}</span>
              <span className="font-body text-xs text-muted-foreground uppercase tracking-wide">Receitas</span>
            </button>
            <button onClick={() => navigate("/favorites")} className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-muted-foreground" />
              <span className="font-body text-sm font-semibold text-foreground">{favorites?.length || 0}</span>
              <span className="font-body text-xs text-muted-foreground uppercase tracking-wide">Favoritos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="bg-card rounded-xl overflow-hidden mb-4 shadow-sm">
        <button
          onClick={() => setEditModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left border-b border-border"
        >
          <User className="w-6 h-6 text-[hsl(var(--terracotta))]" strokeWidth={1.5} />
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Conta</span>
            <span className="font-body text-xs text-muted-foreground uppercase tracking-widest">Perfil, login e dados pessoais</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
        </button>

        <button
          onClick={() => setAppearanceModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left border-b border-border"
        >
          <Palette className="w-6 h-6 text-[hsl(var(--terracotta))]" strokeWidth={1.5} />
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Aparência</span>
            <span className="font-body text-xs text-muted-foreground uppercase tracking-widest">Tema e cores do aplicativo</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
        </button>

        <button
          onClick={() => setSettingsModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left"
        >
          <Settings className="w-6 h-6 text-[hsl(var(--terracotta))]" strokeWidth={1.5} />
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Configurações</span>
            <span className="font-body text-xs text-muted-foreground uppercase tracking-widest">Idioma e sistema de medidas</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
        </button>
      </div>

      {/* Secondary Menu */}
      <div className="bg-card rounded-xl overflow-hidden mb-4 shadow-sm">
        <button
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left border-b border-border"
        >
          <Shield className="w-6 h-6 text-[hsl(var(--terracotta))]" strokeWidth={1.5} />
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Política de Privacidade</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
        </button>

        <button
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left border-b border-border"
        >
          <FileText className="w-6 h-6 text-[hsl(var(--terracotta))]" strokeWidth={1.5} />
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Termos e Condições</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
        </button>

        <button
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left"
        >
          <Info className="w-6 h-6 text-[hsl(var(--terracotta))]" strokeWidth={1.5} />
          <div className="flex-1">
            <span className="font-body text-foreground font-medium block">Sobre</span>
            <span className="font-body text-xs text-muted-foreground uppercase tracking-widest">Versão App 1.0</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
        </button>
      </div>

      {/* Logout */}
      <div className="bg-card rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent text-left"
        >
          <LogOut className="w-6 h-6 text-destructive" strokeWidth={1.5} />
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
