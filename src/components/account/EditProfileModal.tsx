import { useState } from "react";
import { Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUpdateProfile, Profile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  userEmail: string | undefined;
}

const EditProfileModal = ({ open, onOpenChange, profile, userEmail }: EditProfileModalProps) => {
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const updateProfile = useUpdateProfile();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile?.user_id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success("Foto carregada!");
    } catch (error: any) {
      toast.error("Erro ao carregar foto: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    await updateProfile.mutateAsync({
      display_name: displayName || null,
      avatar_url: avatarUrl || null,
    });
    onOpenChange(false);
  };

  const username = userEmail?.split("@")[0] || "usuario";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Editar Perfil</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="Avatar" />
              ) : (
                <AvatarFallback className="bg-secondary">
                  <img src={logo} alt="Cuore" className="w-12 h-auto" />
                </AvatarFallback>
              )}
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Camera className="w-4 h-4" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Nome de exibição</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Usuário</Label>
              <p className="text-sm text-muted-foreground">@{username}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={updateProfile.isPending || uploading}
          >
            {updateProfile.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
