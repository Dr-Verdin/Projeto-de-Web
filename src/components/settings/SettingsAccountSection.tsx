import { Input } from "../ui/input";

type Props = {
  email: string;
  onEmailChange: (value: string) => void;
};

export function SettingsAccountSection({ email, onEmailChange }: Props) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Conta</h3>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">E-mail</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="rounded-xl border-gray-200 bg-gray-50/30 py-3 text-base focus-visible:ring-[#e1903e]"
          placeholder="seu@email.com"
        />
      </div>
    </div>
  );
}
