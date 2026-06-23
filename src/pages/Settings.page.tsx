import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  IconArrowLeft,
  IconChevronRight,
  IconUser,
  IconLock,
  IconMail,
  IconTrash,
  IconCamera,
} from "@tabler/icons-react";
import { SettingsAccountSection } from "../components/settings/SettingsAccountSection";
import { SettingsSecuritySection } from "../components/settings/SettingsSecuritySection";
import { DeleteConfirmView } from "../components/DeleteConfirmView";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import type { User } from "../types/User";

type Section = "menu" | "profile" | "account" | "security" | "delete";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [section, setSection] = useState<Section>("menu");
  const [isSaving, setIsSaving] = useState(false);

  const [avatar, setAvatar]       = useState(user?.avatar ?? "");
  const [name, setName]           = useState(user?.name ?? "");
  const [username, setUsername]   = useState((user?.username ?? "").replace(/^@/, ""));
  const [bio, setBio]             = useState(user?.bio ?? "");
  const [pronoun, setPronoun]     = useState(user?.pronoun ?? "");
  const [email, setEmail]         = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError]     = useState("");

  function handleBack() {
    if (section === "menu") navigate(-1);
    else setSection("menu");
  }

  async function handleSave() {
    if (section === "security") {
      if (newPassword || confirmPassword) {
        if (newPassword.length < 6) { setPasswordError("Mínimo 6 caracteres."); return; }
        if (newPassword !== confirmPassword) { setPasswordError("As senhas não coincidem."); return; }
      }
      setPasswordError("");
    }
    setIsSaving(true);
    try {
      const updatedUser = {
        ...user, avatar, name,
        username: username.startsWith("@") ? username : `@${username}`,
        bio, pronoun, email,
      } as User;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent("user-updated", { detail: { userId: user?.id } }));
      setSection("menu");
    } finally {
      setIsSaving(false);
    }
  }

  function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleDeleteAccount() {
    logout();
    navigate("/login");
  }

  const sectionTitle: Record<Section, string> = {
    menu:     "Configurações",
    profile:  "Editar perfil",
    account:  "Conta",
    security: "Segurança",
    delete:   "Excluir conta",
  };

  const showSave = section !== "menu" && section !== "delete";

  const avatarSrc =
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&background=e1903e&color=fff&size=128`;

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">

      {/* ── HEADER ── */}
      <header className="shrink-0 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <IconArrowLeft size={20} className="text-gray-700" />
        </button>

        <span className="font-bold text-gray-900">{sectionTitle[section]}</span>

        {showSave ? (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-full bg-[#e1903e] text-white text-sm font-bold
                       disabled:opacity-30 active:scale-95 transition-all"
          >
            {isSaving ? "..." : "Salvar"}
          </button>
        ) : (
          <div className="w-16" />
        )}
      </header>

      {/* ── CORPO SCROLLÁVEL ── */}
      <div className="flex-1 min-h-0 overflow-y-auto w-full">

          {/* ── MENU ── */}
          {section === "menu" && (
            <>
              {/* banner ocupa 100% */}
              <div className="w-full bg-gradient-to-b from-[#efce7b]/50 to-gray-50
                              flex flex-col items-center pt-10 pb-12">
                <div className="relative mb-3">
                  <img
                    src={avatarSrc}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-lg"
                  />
                  <button
                    onClick={() => setSection("profile")}
                    className="absolute bottom-0 right-0 w-9 h-9 bg-[#e1903e] rounded-full
                              flex items-center justify-center shadow-md"
                  >
                    <IconCamera size={16} className="text-white" />
                  </button>
                </div>
                <p className="text-xl font-bold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{user?.username}</p>
              </div>

              {/* cards — responsivos */}
              <div className="w-full px-4 -mt-4 pb-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                  <MenuRow icon={IconUser}  label="Editar perfil" subtitle="Nome, foto, bio, pronomes"      onClick={() => setSection("profile")} />
                  <div className="h-px bg-gray-100 mx-5" />
                  <MenuRow icon={IconMail}  label="Conta"         subtitle="E-mail"                         onClick={() => setSection("account")} />
                  <div className="h-px bg-gray-100 mx-5" />
                  <MenuRow icon={IconLock}  label="Segurança"     subtitle="Alterar senha"                  onClick={() => setSection("security")} />
                </div>
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden self-start">
                  <MenuRow icon={IconTrash} label="Excluir conta" subtitle="Ação permanente e irreversível" onClick={() => setSection("delete")} danger />
                </div>
              </div>
            </>
          )}

          {/* ── EDITAR PERFIL ── */}
          {section === "profile" && (
            <div className="flex flex-col pb-10 w-full">
              <div className="w-full bg-gradient-to-b from-[#efce7b]/30 to-gray-50
                              flex flex-col items-center pt-8 pb-8">
                <div className="relative">
                  <img
                    src={avatar || avatarSrc}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-md"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-9 h-9 bg-[#e1903e] rounded-full
                              flex items-center justify-center shadow-md cursor-pointer"
                  >
                    <IconCamera size={16} className="text-white" />
                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-400">Toque para alterar a foto</p>
              </div>

              <div className="w-full max-w-2xl mx-auto flex flex-col gap-5 px-4 pt-4">
                <Field label="Nome">
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome"
                    className="rounded-2xl h-12 text-base px-4 border-gray-200 focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50" />
                </Field>
                <Field label="Nome de usuário">
                  <div className="flex items-center gap-1 h-12 px-4 border border-gray-200 rounded-2xl bg-white
                                  focus-within:border-[#efce7b] focus-within:ring-1 focus-within:ring-[#efce7b]/50 transition-all">
                    <span className="text-gray-400 text-base select-none">@</span>
                    <input value={username} onChange={(e) => setUsername(e.target.value.replace(/^@/, ""))}
                      placeholder="username" className="flex-1 text-base bg-transparent focus:outline-none text-gray-800" />
                  </div>
                </Field>
                <Field label="Pronomes">
                  <Input value={pronoun} onChange={(e) => setPronoun(e.target.value)} placeholder="ex: ela/dela, ele/dele"
                    className="rounded-2xl h-12 text-base px-4 border-gray-200 focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50" />
                </Field>
                <Field label="Bio">
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Fale um pouco sobre você..."
                    rows={4} className="rounded-2xl text-base px-4 py-3 border-gray-200 focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50 resize-none" />
                </Field>
              </div>
            </div>
          )}

          {/* ── CONTA ── */}
          {section === "account" && (
            <div className="px-4 pt-6 pb-10">
              <SettingsAccountSection email={email} onEmailChange={setEmail} />
            </div>
          )}

          {/* ── SEGURANÇA ── */}
          {section === "security" && (
            <div className="px-4 pt-6 pb-10">
              <SettingsSecuritySection
                currentPassword={currentPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                passwordError={passwordError}
                onCurrentPasswordChange={(v) => { setCurrentPassword(v); setPasswordError(""); }}
                onNewPasswordChange={(v) => { setNewPassword(v); setPasswordError(""); }}
                onConfirmPasswordChange={(v) => { setConfirmPassword(v); setPasswordError(""); }}
              />
            </div>
          )}

          {/* ── EXCLUIR ── */}
          {section === "delete" && (
            <div className="px-4 pt-8">
              <DeleteConfirmView
                onCancel={() => setSection("menu")}
                onConfirm={handleDeleteAccount}
              />
            </div>
          )}
        </div>
    </div>
  );
}

/* ── helpers ── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function MenuRow({
  icon: Icon, label, subtitle, onClick, danger = false,
}: {
  icon: React.ComponentType<any>;
  label: string;
  subtitle?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4
                  hover:bg-gray-50 active:bg-gray-100 transition-colors
                  ${danger ? "text-red-500" : "text-gray-700"}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                       ${danger ? "bg-red-50" : "bg-[#efce7b]/30"}`}>
        <Icon size={20} className={danger ? "text-red-500" : "text-[#e1903e]"} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className={`text-sm font-semibold truncate ${danger ? "text-red-500" : "text-gray-800"}`}>
          {label}
        </p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>}
      </div>
      <IconChevronRight size={16} className="text-gray-300 shrink-0" />
    </button>
  );
}
