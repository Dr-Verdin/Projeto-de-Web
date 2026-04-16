import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../lib/mock";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  function handleLogin() {
    setError("");

    const user = Object.values(users).find(
      (u) => u.email === email && u.senha === senha,
    );

    if (!user) {
      setError("Email ou senha inválidos");
      return;
    }

    navigate("/");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isLogin) {
      handleLogin();
    } else {
      setError("Cadastro desativado no mock 😅");
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* imagem lateral */}
      <div className="flex flex-1 bg-[url('/capivaras.jpg')] bg-cover bg-center" />

      {/* formulário */}
      <form
        onSubmit={handleSubmit}
        className="flex w-[550px] flex-col items-center justify-center px-10 gap-5 bg-white"
      >
        <img
          src="/logo_capys_preto.png"
          alt="capibara"
          className="h-20 w-auto"
        />

        <h1 className="text-4xl font-semibold text-gray-700 text-center">
          {isLogin
            ? "De volta aos estudos 📚"
            : "Comece sua jornada estudantil ✏️"}
        </h1>

        {/* email */}
        <Input
          placeholder="Insira seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 pr-10 opacity-80 focus:opacity-100 transition-opacity rounded-2xl text-xs"
        />

        {/* senha */}
        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Insira sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="h-10 pr-10 opacity-80 focus:opacity-100 transition-opacity rounded-2xl text-xs"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <IconEyeOff size={24} /> : <IconEye size={24} />}
          </button>
        </div>

        {/* erro */}
        {error && (
          <p className="text-[#e63946] text-sm bg-[#e63946]/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2 items-center">
          {/* botão principal */}
          <Button
            type="submit"
            className="w-52 py-5 font-semibold text-white bg-[#e1903e]/85 hover:bg-[#e1903e] rounded-3xl"
          >
            {isLogin ? "Acessar conta" : "Cadastrar"}
          </Button>

          {/* esqueci senha */}
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Esqueci minha senha
          </button>
        </div>

        {/* toggle */}
        <Button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-52 py-5 font-semibold bg-[#b7bb86]/85 text-white hover:bg-[#b7bb86] rounded-3xl"
        >
          {isLogin ? "Criar nova conta" : "Já tem uma conta? Faça login"}
        </Button>
      </form>
    </div>
  );
}
