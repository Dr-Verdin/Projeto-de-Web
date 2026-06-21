import { useState, type FormEvent } from "react";
import { IconUpload } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import type { User } from "../types/User";

type ProfileEditorProps = {
  user: User;
  onSave: (updatedUser: User) => void;
};

export function ProfileEditor({ user, onSave }: ProfileEditorProps) {
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username.replace(/^@/, ""));
  const [bio, setBio] = useState(user.bio);
  const [statusMessage, setStatusMessage] = useState("");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      if (result) setAvatar(result);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const updatedUser: User = {
      ...user,
      avatar,
      name,
      username: username.startsWith("@") ? username : `@${username}`,
      bio,
    };

    onSave(updatedUser);
    setStatusMessage("Perfil atualizado com sucesso!");

    setTimeout(() => setStatusMessage(""), 3000);
  }

  return (
    <div className="w-full rounded-3xl bg-white p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Editar perfil</h2>
        <p className="text-sm text-gray-500">Atualize sua foto, nome, usuário e descrição.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Foto do perfil</label>

          <div className="flex items-center gap-4">
            <img src={avatar} alt="Avatar selecionado" className="h-16 w-16 rounded-full object-cover border border-gray-200" />

            <label htmlFor="avatar-file" className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#e1903e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#cf7f2c]">
              <IconUpload size={16} />
              Alterar foto
            </label>

            <input id="avatar-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <p className="text-xs text-gray-500">Selecione uma imagem do seu computador.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nome completo</label>
          <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nome de usuário</label>
          <Input placeholder="seu_usuario" value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-2xl" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Biografia</label>
          <Textarea placeholder="Uma frase sobre você" value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[96px] rounded-2xl" />
        </div>

        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-full rounded-3xl bg-[#e1903e]/90 text-white hover:bg-[#e1903e]">Salvar alterações</Button>
          {statusMessage ? <p className="text-sm text-green-600">{statusMessage}</p> : null}
        </div>
      </form>
    </div>
  );
}
