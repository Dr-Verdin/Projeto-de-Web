import { useState } from "react";
import { Button } from "./ui/button";
import type { User } from "../types/User";
import { SettingsProfileSection } from "./settings/SettingsProfileSection";
import { useAuth } from "../contexts/AuthContext";
import { IconTrash } from "@tabler/icons-react";

type SettingsViewProps = {
  user: User;
  onSave: (updatedUser: User) => void;
  onDeleteClick: () => void;
  isSaving?: boolean;
};

export function SettingsView({ user, onSave, onDeleteClick, isSaving = false }: SettingsViewProps) {
  const { updateUser } = useAuth();
  const [avatar, setAvatar]   = useState(user.avatar ?? "");
  const [name, setName]       = useState(user.name ?? "");
  const [username, setUsername] = useState((user.username ?? "").replace(/^@/, ""));
  const [bio, setBio]         = useState(user.bio ?? "");
  const [pronoun, setPronoun] = useState(user.pronoun ?? "");
  const [error, setError]     = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const updated = await updateUser({
        name,
        username: username.startsWith("@") ? username : `@${username}`,
        bio,
        pronoun,
        avatar,
      });
      onSave(updated);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Erro ao salvar. Tente novamente.");
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh]">

      {/* Área scrollável */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 scrollbar-none">

        {/* Header */}
        <div className="pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
          <p className="text-sm text-gray-400 mt-0.5">Gerencie suas informações e preferências de conta</p>
        </div>

        <SettingsProfileSection
          avatar={avatar} name={name} username={username} pronoun={pronoun} bio={bio}
          onAvatarChange={setAvatar} onNameChange={setName} onUsernameChange={setUsername}
          onPronounChange={setPronoun} onBioChange={setBio}
        />

        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}

        {/* Excluir conta — zona de perigo */}
        <div className="pt-2 pb-2 border border-red-100 rounded-2xl bg-red-50/50 overflow-hidden">
          <button
            type="button"
            onClick={onDeleteClick}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-100">
              <IconTrash size={20} className="text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-500">Excluir conta</p>
              <p className="text-xs text-red-400 mt-0.5">Todos os seus dados serão removidos.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Rodapé fixo */}
      <div className="shrink-0 px-6 md:px-8 py-6 border-t border-gray-200 bg-white rounded-b-3xl">
        <form onSubmit={handleSubmit}>
          <Button
            type="submit"
            className="rounded-full px-6 h-10 text-sm text-white bg-[#b7bb86] hover:bg-[#e1903e] transition shadow-sm"
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </div>
    </div>
  );
}
