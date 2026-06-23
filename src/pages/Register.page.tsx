import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function Register() {
  const [email, setEmail]       = useState("");
  const [name, setName]         = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha]       = useState("");
  const [error, setError]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleRegister() {
    setError("");
    if (!email || !senha || !username || !name) {
      setError("Preencha todos os campos");
      return;
    }
    try {
      await authService.register({ name, username, email, password: senha });
      navigate("/login");
    } catch {
      setError("Erro ao criar conta");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleRegister();
  }

  return (
    <div className="flex h-screen w-screen">

      {/* imagem lateral — some no mobile */}
      <div className="hidden md:flex flex-1 bg-[url('/fundo_registro.png')] bg-cover bg-center" />

      {/* formulário */}
      <form
        onSubmit={handleSubmit}
        className="
          relative flex flex-col w-full md:max-w-md
          items-center justify-center
          px-6 sm:px-10 gap-5 bg-white overflow-y-auto
          max-md:bg-[url('/fundo_registro.png')] max-md:bg-cover max-md:bg-center
        "
      >
        {/* overlay no mobile */}
        <div className="md:hidden absolute inset-0 bg-white/80 backdrop-blur-sm" />

        <div className="relative z-10 w-full flex flex-col items-center gap-5 py-8">

          {/* logo + título */}
          <div className="flex flex-col items-center gap-2">
            <img src="/logo_capys.png" alt="capibara" className="h-16 w-16 md:h-20 md:w-20" />
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-700 text-center">
              Comece sua jornada estudantil ✏️
            </h1>
          </div>

          {/* campos */}
          <div className="w-full flex flex-col gap-3">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 opacity-80 focus:opacity-100 transition-opacity rounded-2xl text-sm"
            />
            <Input
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 opacity-80 focus:opacity-100 transition-opacity rounded-2xl text-sm"
            />
            <Input
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 opacity-80 focus:opacity-100 transition-opacity rounded-2xl text-sm"
            />
            <InputGroup className="h-11 pr-2 opacity-80 focus:opacity-100 transition-opacity rounded-2xl text-sm">
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
          </div>

          {/* botões */}
          <div className="w-full flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full py-5 font-semibold text-white bg-[#e1903e]/85 hover:bg-[#e1903e] rounded-3xl"
            >
              Cadastrar
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-5 font-semibold bg-[#8ed1e4]/85 text-white hover:bg-[#8ed1e4] rounded-3xl"
            >
              Já tem uma conta? Faça login
            </Button>
          </div>

          {/* erro */}
          <p className={`text-[#e63946] text-sm transition-opacity duration-300 text-center ${error ? "opacity-100" : "opacity-0"}`}>
            {error || "placeholder"}
          </p>
        </div>
      </form>
    </div>
  );
}
