{/*Componente para mostrar os usuários que tem pra conversar*/}
import { users } from "../lib/mock";


type CommonUsersProps = {
    onSelectUser?: (userId: string) => void;
};

export default function CommonUsers({ onSelectUser }: CommonUsersProps) {
    // Pegando os 3 primeiros usuários do mock para simular os "frequentes"
    const frequentUsers = Object.entries(users).slice(0, 3);

    return (
        <div className="flex flex-col mt-4">
            <p className="text-sm text-gray-500 mb-2 px-2 font-medium">Amigos</p>
            
            <div className="flex flex-col gap-1">
                {frequentUsers.map(([id, user]) => (
                    <button
                        key={id}
                        onClick={() => onSelectUser && onSelectUser(id)}
                        className="flex items-center gap-3 w-full py-3 px-2 rounded-md hover:bg-[#aadeff]/20 transition-colors text-left"
                    >
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0"
                        />
                        <div className="flex flex-col text-left  min-w-0 flex-1">
                            <span className="text-md text-slate-900 truncate">{user.name}</span>
                            <span className="text-sm text-slate-400 truncate">{user.username}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}