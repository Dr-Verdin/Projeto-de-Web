import { CalendarDays, Globe } from "lucide-react"

interface Props{
    name: string
    description: string
    createdAt: string 
    visibility: string
    members: number
    rules?: string
}

export function Informacoes({name, description, createdAt, visibility, members, rules}: Props){
    return (
        <div className="w-full max-w-[320px] min-w-[180px] h-auto bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-3 text-sm text-slate-700">
            <h2 className="font-bold text-base text-slate-800">{name}</h2>
            <p>{description}</p>

            <div className="flex flex-col gap-2 text-slate-500">
                <span className="flex items-center gap-1 leading-none"><CalendarDays size={14} className="shrink-0" /> Criada em {new Date(createdAt).toLocaleDateString("pt-BR", {month: "long", year: "numeric"})}</span>
                <span className="flex items-center gap-1 leading-none"><Globe size={14} className="shrink-0" /> {visibility}</span>
            </div>

            <div className="flex items-baseline gap-1 pt-2 border-t border-slate-100">
                <p className="font-semibold text-slate-800">{members.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-slate-500">Membros</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <p className="font-semibold text-slate-800">Regras</p>
                <ol className="list-decimal list-inside flex flex-col gap-1 text-slate-600">
                    {rules?.split("\n").filter(Boolean).map((rule, i) => (
                    <li key={i}>{rule.replace(/^\d+\.\s*/, "")}</li>
                    ))}
                </ol>
            </div>           
        </div>
    )
}