import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button" 
import {useState} from "react"

function Login(){

    const [isLogin, setIsLogin] = useState(true)

    return(
        <div className="flex h-screen w-screen justify bg-[#fafafa]">
            <div className="relative flex flex-1 flex-col items-center bg-[url('/capivaras.jpg')] bg-cover bg-center">
            </div>
            <div className="w-px bg-[#3a3a3a]"></div>

            <div className="flex w-[550px] flex-col items-center justify-center px-10 gap-5 bg-white">
                <img src="/capibara.png" alt="capibara" className="invert h-20 w-auto" />
                <h2 className="text-xl font-semibold text-gray-700">
                    {isLogin ? "Acessar a plataforma" : "Cadastro"} 
                </h2>

                <Input type ="text" placeholder="email" className=" h-10 bg-[#fafafa] text-xs border-[#363636] placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#548C2F]c rounded-2xl"></Input>
                <Input type ="password" placeholder="password" className=" h-10 bg-[#fafafa] border-[#363636] text-xs placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#548C2F]c rounded-2xl"></Input>

                <Button className="w-full font-semibold text-white/100 bg-[#f9a620]/85 hover:bg-[#f9a620] rounded-3xl">
                    {isLogin ? "Log in":"Cadastrar"}
                </Button>

                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <span className="text-xs text-black/80 font-bold uppercase">ou</span>
                    <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                <Button onClick={() => setIsLogin(!isLogin)} className=" w-full bg-[#a3b18a]/90 text-white/100 hover:bg-[#a3b18a] rounded-3xl">
                    {isLogin ? "Criar nova conta" : "Já tem uma conta? Faça login"}
                </Button>
            </div>
        </div>
    )
}

export default Login