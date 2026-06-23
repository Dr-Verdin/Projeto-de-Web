import { Input } from "../ui/input";

type Props = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
};

export function SettingsSecuritySection({
  currentPassword, newPassword, confirmPassword, passwordError,
  onCurrentPasswordChange, onNewPasswordChange, onConfirmPasswordChange,
}: Props) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Segurança</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Senha atual</label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
            className="rounded-xl border-gray-200 bg-gray-50/30 py-3 text-base focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50 placeholder:text-gray-400"
            placeholder=""
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Nova senha</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            className="rounded-xl border-gray-200 bg-gray-50/30 py-3 text-base focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50 placeholder:text-gray-400"
            placeholder=""
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Confirmar nova senha</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className="rounded-xl border-gray-200 bg-gray-50/30 py-3 text-base focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50 placeholder:text-gray-400"
            placeholder=""
          />
        </div>
      </div>

      {passwordError && (
        <p className="mt-2 text-sm text-red-500 font-medium">{passwordError}</p>
      )}
      <p className="mt-2 text-xs text-gray-400">Deixe em branco para manter a senha atual.</p>
    </div>
  );
}
