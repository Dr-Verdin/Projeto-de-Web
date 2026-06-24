import { IconReload, IconMaximize } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";

type TimerMode = "pomodoro" | "short pause" | "long pause";

function Pomodoro() {
  const { user } = useAuth();
  const hasSavedRef = useRef(false);

  const modes: Record<TimerMode, number> = {
    "pomodoro": 40 * 60,
    "short pause": 10 * 60,
    "long pause": 20 * 60,
  };

  const [currentMode, setCurrentMode] = useState<TimerMode>("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState<number>(modes["pomodoro"]);
  const [isActive, setIsActive] = useState<boolean>(false);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    if (isActive && secondsLeft === 0 && !hasSavedRef.current && currentMode === "pomodoro") {
      setIsActive(false);
      hasSavedRef.current = true;
      const hours = Math.round((modes[currentMode] / 3600) * 100) / 100;
      saveStudyTime(hours);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [isActive, secondsLeft, currentMode]);

  const handleModeChange = (mode: TimerMode) => {
    setCurrentMode(mode);
    setIsActive(false);
    setSecondsLeft(modes[mode]);
    hasSavedRef.current = false;
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(modes[currentMode]);
    hasSavedRef.current = false;
  };

  const fullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  async function saveStudyTime(hours: number) {
    const userId = user?.id ?? user?.sub;
    if (!userId) return;
    try {
      await userService.addStudyTime(userId, hours);
    } catch (err) {
      console.error("Erro ao salvar tempo de estudo:", err);
    }
  }

  return (
    <div
      className="relative flex min-h-full w-full flex-col items-center justify-center bg-cover bg-center font-sans text-white overflow-hidden"
      style={{ backgroundImage: "url('/wallpaper_pomodoro.jpg')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* conteúdo central */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 w-full max-w-lg">

        {/* abas de modo */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {(Object.keys(modes) as TimerMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-5 md:px-6 py-2 md:py-2 text-sm font-medium rounded-full transition-all shadow-lg border border-white/40 backdrop-blur-xl
                ${currentMode === mode ? "bg-white/40 border-white/60" : "bg-white/20 hover:bg-white/30"}`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* timer */}
        <h2
          className="font-bold leading-none tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
          style={{ fontSize: "clamp(4.5rem, 22vw, 9rem)" }}
        >
          {formatTime(secondsLeft)}
        </h2>

        {/* controles */}
        <div className="flex items-center gap-6 md:gap-7">
          <Button
            onClick={() => setIsActive(!isActive)}
            className="rounded-full bg-white/20 px-10 md:px-12 py-5 md:py-6 text-lg font-bold text-white backdrop-blur-md border border-white/40 hover:bg-white/30 transition-all shadow-md"
          >
            {isActive ? "pause" : "start"}
          </Button>

          <button
            onClick={resetTimer}
            className="opacity-90 hover:opacity-100 hover:scale-110 transition-transform"
          >
            <IconReload size={40} />
          </button>
        </div>
      </div>

      {/* botão fullscreen */}
      <button
        onClick={fullScreen}
        className="fixed right-6 bottom-24 md:bottom-10 z-20 opacity-85 hover:opacity-100 hover:scale-110 transition-transform"
      >
        <IconMaximize size={52} className="md:hidden" />
        <IconMaximize size={60} className="hidden md:block" />
      </button>
    </div>
  );
}

export default Pomodoro;