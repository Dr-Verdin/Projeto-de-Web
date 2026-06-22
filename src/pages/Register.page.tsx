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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleRegister() {
    setError("");

    if (!email || !senha || !username || !name) {
      setError("Preencha todos os campos");
      return;
    }

    try {
      await authService.register({
        name,
        username,
        email,
        password: senha,
      });

      navigate("/login");
    } catch (err: any) {
      setError("Erro ao criar conta");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleRegister();
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
            Comece sua jornada estudantil ✏️
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

            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 pr-10 opacity-80 focus:opacity-100 transition-opacity rounded-2xl text-xs"
            />

            <Input
              placeholder="Create an username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* botão principal */}
          <Button type="submit" className="w-52 py-5 font-semibold text-white bg-[#e1903e]/85 hover:bg-[#e1903e] rounded-3xl">
            Cadastrar
          </Button>

          {/* toggle */}
          <Button type="button" onClick={() => navigate('/login')} className="w-52 py-5 font-semibold bg-[#b7bb86]/85 text-white hover:bg-[#b7bb86] rounded-3xl">
            Já tem uma conta? Faça login
          </Button>
        </div>

        {/* erro */}
        <p className={`text-[#e63946] text-sm px-3 py-2 rounded-lg transition-opacity duration-300 ${error ? "opacity-100" : "opacity-0"}`}>
          {error || "placeholder"}
        </p>
      </form>
    </div>
  );
}
