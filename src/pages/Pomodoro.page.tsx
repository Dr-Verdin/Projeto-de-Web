import {
  IconReload,
  IconMaximize,
} from "@tabler/icons-react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type TimerMode = 'pomodoro' | 'short pause' | 'long pause'

function Pomodoro() {
    const modes: Record<TimerMode, number> = {
        'pomodoro': 30 * 60,
        'short pause': 5 * 60,
        'long pause': 15 * 60
    }

    const [currentMode, setCurrentMode] = useState<TimerMode>('pomodoro')
    const [secondsLeft, setSecondsLeft] = useState<number>(modes['pomodoro'])
    const [isActive, setIsActive] = useState<boolean>(false)

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        let interval = null

        if (isActive && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft((prev) => prev - 1)
            }, 1000)
        } else if (secondsLeft === 0) {
            setIsActive(false)
            if (interval) clearInterval(interval)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, secondsLeft])

    const handleModeChange = (mode: TimerMode): void => {
        setCurrentMode(mode)
        setIsActive(false)
        setSecondsLeft(modes[mode])
    }

    const resetTimer = (): void => {
        setIsActive(false)
        setSecondsLeft(modes[currentMode])
    }

    const fullScreen = (): void => {
        if(!document.fullscreenElement){
            document.documentElement.requestFullscreen().catch(err =>{
                console.error(`Error attempting to enable fullscreen: ${err.message}`)
            })
        } else{
            document.exitFullscreen()
        }
    }

    return (
        <div className="relative flex min-h-full w-full flex-col items-center justify-center bg-cover bg-center font-sans text-white"
            style={{ backgroundImage: "url('/wallpaper_pomodoro.jpg')" }}>
        
            <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="flex gap-4">
                    {(Object.keys(modes) as TimerMode[]).map((mode) => ( 
                        <button 
                            key={mode} 
                            onClick={() => handleModeChange(mode)}
                            className={`px-6 py-2 text-sm font-medium rounded-full transition-all shadow-lg border border-white/40 backdrop-blur-xl 
                                ${currentMode === mode ? 'bg-white/40 border-white/60' : 'bg-white/20 hover:bg-white/30'}`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>

                <h2 className="text-9xl font-bold leading-none tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                    {formatTime(secondsLeft)}
                </h2>

                <div className="mt-2 flex items-center gap-7">
                    <Button 
                        onClick={() => setIsActive(!isActive)}
                        className="rounded-full bg-white/20 px-12 py-6 text-lg font-bold text-white backdrop-blur-md border border-white/40 hover:bg-white/30 transition-all shadow-md">
                            
                        {isActive ? 'pause' : 'start'}
                    </Button>

                    <button 
                        onClick={resetTimer}
                        className="opacity-90 hover:opacity-100 hover:scale-110 transition-transform">

                        <IconReload size={45} />
                    </button>
                    
                   {/* <button className ="opacity-80 hover:opacity-100 hover:scale-110 transition-transform">
                        <IconSettings size={45} />
                    </button>*/}
                </div>
            </div>

            {/* fixed na tela real, acima da barra de navegação mobile */}
            <div className="fixed right-6 bottom-24 md:bottom-10 z-20">
                <button 
                    onClick={fullScreen}
                    className="opacity-85 hover:opacity-100 hover:scale-110 transition-transform">
                        
                    <IconMaximize size={60} />
                </button>
            </div>
        </div>
    );
}

export default Pomodoro;