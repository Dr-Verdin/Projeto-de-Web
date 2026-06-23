import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { ForgotPasswordModal } from "../components/ForgotPasswordModal";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setError("");
    try {
      await login(email, senha);
      navigate("/");
    } catch {
      setError("Email ou senha inválidos");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleLogin();
  }

  return (
    <div className="flex h-screen w-screen">

      {/* imagem lateral — some no mobile */}
      <div className="hidden md:flex flex-1 bg-[url('/capivaras.jpg')] bg-cover bg-center" />

      {/* formulário */}
      <form
        onSubmit={handleSubmit}
        className="
          relative flex flex-col w-full md:max-w-md
          items-center justify-center
          px-6 sm:px-10 gap-6 bg-white
          /* no mobile coloca a imagem como fundo com overlay */
          max-md:bg-[url('/capivaras.jpg')] max-md:bg-cover max-md:bg-center
        "
      >
        {/* overlay escuro só no mobile para legibilidade */}
        <div className="md:hidden absolute inset-0 bg-white/80 backdrop-blur-sm" />

        {/* conteúdo acima do overlay */}
        <div className="relative z-10 w-full flex flex-col items-center gap-6">

          {/* logo + título */}
          <div className="flex flex-col items-center gap-2">
            <img src="/logo_capys.png" alt="capibara" className="h-16 w-16 md:h-20 md:w-20" />
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-700 text-center">
              De volta aos estudos 📚
            </h1>
          </div>

          {/* campos */}
          <div className="w-full flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 bg-[#fafafa] text-xs border-[#363636] placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#548C2F] rounded-2xl"
          />

            <InputGroup className="h-10 bg-[#fafafa] text-xs border-[#363636] placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#548C2F] rounded-2xl">
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </InputGroupAddon>
            </InputGroup>

            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-xs text-gray-500 hover:underline text-left w-fit"
            >
              Esqueci minha senha
            </button>
          </div>

          {/* botões */}
          <div className="w-full flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full py-5 font-semibold text-white bg-[#e1903e]/85 hover:bg-[#e1903e] rounded-3xl"
            >
              Entrar
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full py-5 font-semibold bg-[#b7bb86]/85 text-white hover:bg-[#b7bb86] rounded-3xl"
            >
              Criar nova conta
            </Button>
          </div>

          {/* erro */}
          <p className={`text-[#e63946] text-sm transition-opacity duration-300 text-center ${error ? "opacity-100" : "opacity-0"}`}>
            {error || "placeholder"}
          </p>
        </div>
      </form>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}
