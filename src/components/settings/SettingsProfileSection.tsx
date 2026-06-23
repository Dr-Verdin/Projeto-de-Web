import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Props = {
  avatar: string;
  name: string;
  username: string;
  pronoun: string;
  bio: string;
  onAvatarChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onPronounChange: (value: string) => void;
  onBioChange: (value: string) => void;
};

export function SettingsProfileSection({
  avatar, name, username, pronoun, bio,
  onAvatarChange, onNameChange, onUsernameChange, onPronounChange, onBioChange,
}: Props) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      if (result) onAvatarChange(result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Perfil</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start w-full">

        {/* Avatar */}
        <div className="md:col-span-1 flex flex-col items-center justify-center border border-gray-100 bg-gray-50/50 rounded-2xl p-6 w-full text-center">
          <div className="w-28 h-28 md:w-32 md:h-32 mb-4">
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-sm"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{name}</h3>
          <p className="text-sm text-gray-400 mb-4">@{username}</p>
          <label
            htmlFor="avatar-file"
            className="cursor-pointer text-xs font-semibold text-gray-600 rounded-xl border border-gray-200 bg-white px-4 py-2 transition hover:bg-gray-50 shadow-sm"
          >
            Alterar foto
          </label>
          <input id="avatar-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Campos de texto */}
        <div className="md:col-span-2 space-y-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Nome</label>
              <Input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="rounded-xl border-gray-200 bg-gray-50/30 py-3 text-base  text-gray-400 focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50"
                placeholder="Adicione seu nome"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Usuário</label>
              <Input
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                className="rounded-xl border-gray-200 bg-gray-50/30 py-3 text-base text-gray-400 focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50"
                placeholder="Adicione seu usuário"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Pronomes</label>
            <Input
              value={pronoun}
              onChange={(e) => onPronounChange(e.target.value)}
              className="rounded-xl border-gray-200 bg-gray-50/30 py-3 text-gray-400 text-base focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50"
              placeholder="ex: ele/dele, ela/dela, elu/delu"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Biografia</label>
            <Textarea
              value={bio}
              onChange={(e) => onBioChange(e.target.value)}
              className="rounded-xl border-gray-200 bg-gray-50/30 text-base  text-gray-400 focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50 resize-none p-4"
              rows={3}
              placeholder="Adicione uma descrição..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
