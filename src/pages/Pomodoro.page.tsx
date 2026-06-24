import { IconReload, IconMaximize } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";

type TimerMode = "pomodoro" | "short pause" | "long pause";

function Pomodoro() {
  const { user } = useAuth();
  const hasSavedRef = useRef(false);
  // rastreia segundos estudados desde o último save
  const accumulatedRef = useRef(0);

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

  async function saveStudyTime(seconds: number) {
    if (seconds <= 0) return;
    const userId = user?.id ?? user?.sub;
    if (!userId) return;
    const hours = Math.round((seconds / 3600) * 100) / 100;
    if (hours <= 0) return;
    try {
      await userService.addStudyTime(userId, hours);
    } catch (err) {
      console.error("Erro ao salvar tempo de estudo:", err);
    }
  }

  // salva ao pausar, trocar modo, resetar ou sair da página
  function flushAccumulated() {
    if (currentMode !== "pomodoro") return;
    if (accumulatedRef.current > 0) {
      saveStudyTime(accumulatedRef.current);
      accumulatedRef.current = 0;
    }
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
        if (currentMode === "pomodoro") {
          accumulatedRef.current += 1;
        }
      }, 1000);
    }

    // timer terminou — salva e marca
    if (isActive && secondsLeft === 0 && !hasSavedRef.current && currentMode === "pomodoro") {
      setIsActive(false);
      hasSavedRef.current = true;
      flushAccumulated();
    }

    return () => { if (interval) clearInterval(interval); };
  }, [isActive, secondsLeft, currentMode]);

  // salva quando sai da página (fecha aba, navega para outra rota)
  useEffect(() => {
    function handleUnload() { flushAccumulated(); }
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      flushAccumulated(); // salva ao desmontar o componente (troca de rota)
    };
  }, []);

  const handleModeChange = (mode: TimerMode) => {
    if (isActive) flushAccumulated(); // salva antes de trocar modo
    setCurrentMode(mode);
    setIsActive(false);
    setSecondsLeft(modes[mode]);
    hasSavedRef.current = false;
    accumulatedRef.current = 0;
  };

  const resetTimer = () => {
    if (isActive) flushAccumulated(); // salva antes de resetar
    setIsActive(false);
    setSecondsLeft(modes[currentMode]);
    hasSavedRef.current = false;
    accumulatedRef.current = 0;
  };

  const handleStartPause = () => {
    if (isActive) {
      // pausando — salva o que acumulou
      flushAccumulated();
    }
    setIsActive(!isActive);
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
            onClick={handleStartPause}
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