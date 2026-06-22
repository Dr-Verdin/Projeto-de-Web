import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { users } from "../lib/mock";

type ForgotPasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

type Step = "email" | "success";

export function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("email");

  function handleClose() {
    onClose();
    // reset after close animation
    setTimeout(() => {
      setEmail("");
      setError("");
      setStep("email");
    }, 200);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const exists = Object.values(users).some((u) => u.email === email.trim());

    if (!exists) {
      setError("Nenhuma conta encontrada com esse e-mail.");
      return;
    }

    setStep("success");
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-sm w-full rounded-3xl border-none bg-white p-8 shadow-2xl">
        {step === "email" ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Esqueci minha senha</h2>
              <p className="text-sm text-gray-400 mt-1">
                Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="seu@email.com"
                className="rounded-xl border-gray-200 bg-gray-50/30 py-3 text-base focus-visible:ring-[#e1903e]"
                autoFocus
              />
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>

            <Button
              type="submit"
              className="rounded-full px-6 h-10 text-sm text-white bg-[#b7bb86] hover:bg-[#e1903e] transition w-full"
            >
              Enviar instruções
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl">
              ✉️
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">E-mail enviado!</h2>
              <p className="text-sm text-gray-400 mt-1">
                Se houver uma conta com o e-mail <span className="font-semibold text-gray-600">{email}</span>, você receberá as instruções em breve.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleClose}
              className="rounded-full px-6 h-10 text-sm text-white bg-[#b7bb86] hover:bg-[#e1903e] transition w-full"
            >
              Voltar ao login
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
