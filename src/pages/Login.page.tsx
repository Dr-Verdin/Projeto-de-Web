import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../lib/mock";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleLogin() {
    setError("");

    const user = Object.values(users).find(
      (u) => u.email === email && u.senha === senha
    );

    if (!user) {
      setError("Email ou senha inválidos");
      return;
    }

    // sucesso → vai pro feed
    navigate("/");
  }

  function handleSubmit() {
    if (isLogin) {
      handleLogin();
    } else {
      setError("Cadastro desativado no mock 😅");
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50">

      {/* imagem lateral */}
      <div className="relative flex flex-1 flex-col items-center bg-[url('/capivaras.jpg')] bg-cover bg-center" />

      {/* formulário */}
      <div className="flex w-[550px] flex-col items-center justify-center px-10 gap-5 bg-white">

        <img
          src="/logo_capys_preto.png"
          alt="capibara"
          className="h-20 w-auto"
        />

        <h2 className="text-2xl font-semibold text-gray-700">
          {isLogin ? "De volta aos estudos 📚" : "Comece sua jornada estudantil ✏️"}
        </h2>

        {/* email */}
        <Input
          type="text"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 bg-[#fafafa] text-xs border-[#363636] placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#548C2F] rounded-2xl"
        />

        {/* senha */}
        <Input
          type="password"
          placeholder={
            isLogin ? "Sua senha" : "Crie uma senha (mínimo 8 caracteres)"
          }
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="h-10 bg-[#fafafa] text-xs border-[#363636] placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#548C2F] rounded-2xl"
        />

        {/* erro */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* botão principal */}
        <Button
          onClick={handleSubmit}
          className="w-64 font-semibold text-white bg-[#f9a620]/85 hover:bg-[#f9a620] rounded-3xl"
        >
          {isLogin ? "Acessar conta" : "Cadastrar"}
        </Button>

        {/* toggle login/cadastro */}
        <Button
          onClick={() => setIsLogin(!isLogin)}
          className="w-64 font-semibold bg-[#A2B7AD]/90 text-white hover:bg-[#A2B7AD] rounded-3xl"
        >
          {isLogin
            ? "Criar nova conta"
            : "Já tem uma conta? Faça login"}
        </Button>

      </div>
    </div>
  );
}
