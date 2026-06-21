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

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setError("");

    try {
      await login(email, senha);
      navigate("/");
    } catch (err: any) {
      setError("Email ou senha inválidos");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleLogin();
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* imagem lateral */}
      <div className="flex flex-1 bg-[url('/capivaras.jpg')] bg-cover bg-center" />

      {/* formulário */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md min-h-xl items-center justify-center px-10 gap-5 bg-white"
      >
        <div className="flex justify-center flex-col">
          <div className="flex justify-center">
            <img src="/logo_capys.png" alt="capibara" className="h-20 w-20" />
          </div>

          <h1 className="text-4xl font-semibold text-gray-700 text-center">
            De volta aos estudos 📚
          </h1>
        </div>

        <div className="w-full">
          {/* email */}
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 pr-10 opacity-80 focus:opacity-100 transition-opacity rounded-2xl text-xs"
            />

            {/* senha */}
            <InputGroup className="h-10 pr-2 opacity-80 focus:opacity-100 transition-opacity rounded-2xl text-xs">
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* esqueci senha */}
          <button
            type="button"
            className="text-xs text-gray-500 hover:underline hover:decoration-gray-500"
          >
            Esqueci minha senha
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* botão principal */}
          <Button
            type="submit"
            className="w-52 py-5 font-semibold text-white bg-[#e1903e]/85 hover:bg-[#e1903e] rounded-3xl"
          >
            Entrar
          </Button>

          {/* toggle */}
          <Button
            type="button"
            onClick={() => navigate("/register")}
            className="w-52 py-5 font-semibold bg-[#b7bb86]/85 text-white hover:bg-[#b7bb86] rounded-3xl"
          >
            Criar nova conta
          </Button>
        </div>

        {/* erro */}
        <p
          className={`text-[#e63946] text-sm px-3 py-2 rounded-lg transition-opacity duration-300 ${
            error ? "opacity-100" : "opacity-0"
          }`}
        >
          {error || "placeholder"}
        </p>
      </form>
    </div>
  );
}
