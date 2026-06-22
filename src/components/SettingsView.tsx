import { useState } from "react";
import { Button } from "./ui/button";
import type { User } from "../types/User";
import { SettingsProfileSection } from "./settings/SettingsProfileSection";
import { SettingsAccountSection } from "./settings/SettingsAccountSection";
import { SettingsSecuritySection } from "./settings/SettingsSecuritySection";

type SettingsViewProps = {
  user: User;
  onSave: (updatedUser: User) => void;
  onDeleteClick: () => void;
  isSaving?: boolean;
};

export function SettingsView({ user, onSave, onDeleteClick, isSaving = false }: SettingsViewProps) {
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username.replace(/^@/, ""));
  const [bio, setBio] = useState(user.bio);
  const [pronoun, setPronoun] = useState(user.pronoun ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function clearPasswordError() {
    setPasswordError("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (newPassword || confirmPassword || currentPassword) {
      if (currentPassword !== user.senha) {
        setPasswordError("Senha atual incorreta.");
        return;
      }
      if (newPassword.length < 6) {
        setPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("As senhas não coincidem.");
        return;
      }
    }

    setPasswordError("");
    onSave({
      ...user,
      avatar,
      name,
      username: username.startsWith("@") ? username : `@${username}`,
      bio,
      pronoun,
      email,
      ...(newPassword ? { senha: newPassword } : {}),
    });
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

        <SettingsAccountSection email={email} onEmailChange={setEmail} />

        <SettingsSecuritySection
          currentPassword={currentPassword} newPassword={newPassword} confirmPassword={confirmPassword}
          passwordError={passwordError}
          onCurrentPasswordChange={(v) => { setCurrentPassword(v); clearPasswordError(); }}
          onNewPasswordChange={(v) => { setNewPassword(v); clearPasswordError(); }}
          onConfirmPasswordChange={(v) => { setConfirmPassword(v); clearPasswordError(); }}
        />

        {/* Excluir conta — dentro do scroll, no fim */}
        <div className="pt-2 pb-2">
          <button
            type="button"
            onClick={onDeleteClick}
            className="text-sm font-bold text-red-500 hover:underline"
          >
            Excluir conta
          </button>
          <p className="text-xs text-gray-400 mt-0.5">Todos os seus dados serão removidos.</p>
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
