import Texto from "../components/Post";
import BotaoComu from "../components/botaocomunidades";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, 
  NavigationMenuTrigger} from "../components/ui/navigation-menu";
import estudando from "@/assets/estudando.png"

function Feed() {
  return (
      <>
        <header>

        </header>
            <main className="bg-slate-100 w-full min-h-screen flex justify-center items-start flex-row p-4">          
              <div className="flex flex-row items-start gap-[64px]">
                <div className="w-[732px] min-h-screen flex items-center flex-col gap-[10px]" >
                  <div className="w-[732px] h-[40px] text-black flex justify-start items-center gap-[20px] pl-[16px] pr-[16px]">
                    <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                        <NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                  </div>
                  <div className="w-[732px] min-h-screen flex flex-col gap-[24px]">
                    <Texto nome="amanda" time="há 21h" titulo="Nem sono vence a necessidade de passar" texto="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum..."></Texto>
                    <Texto nome="camila" time="6d" fotoPost={estudando} titulo="Nem sono vence a necessidade de passar"></Texto>
                    <Texto nome="matheus" time="6d"></Texto>
                    <Texto nome="bruna" time="6d"></Texto>
                  </div>
                </div>
                <div className="rounded-md w-[319px] h-[321px] border-[3px] border-[#A8D5E2] flex items-start pl-[16px] pr-[16px] sticky top-4 flex-col gap-[5px]">
                  <div className="pt-[4px] text-[#A8D5E2] text-sm font-bold">COMUNIDADES POPULARES</div>
                  <div className="w-[284px] h-[245px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                    <BotaoComu nome="geografia" inscritos="1.000"></BotaoComu>
                    <BotaoComu nome="matemática" inscritos="1.000.000"></BotaoComu>
                    <BotaoComu nome="Redes" inscritos="5.700.000"></BotaoComu>
                    <BotaoComu nome="Web" inscritos="5.900.000"></BotaoComu>
                    <BotaoComu nome="Web" inscritos="5.900.000"></BotaoComu>
                    <BotaoComu nome="Web" inscritos="5.900.000"></BotaoComu>
                  </div>
                  <button className="text-xs hover:text-slate-950 text-[16px] text-slate-700 transition-colors pl-1">
                    ver mais
                  </button>
                </div>
          </div>
        </main>
      </>
  )
}

export default Feed

