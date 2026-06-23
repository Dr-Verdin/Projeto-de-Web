import { IconReload, IconMaximize } from "@tabler/icons-react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

type TimerMode = "pomodoro" | "short pause" | "long pause";

function Pomodoro() {
  const { user } = useAuth();
  const hasSavedRef = useRef(false);

  const modes: Record<TimerMode, number> = {
    "pomodoro": 1 * 60,
    "short pause": 5 * 60,
    "long pause": 15 * 60,
  };

  const [currentMode, setCurrentMode] = useState<TimerMode>("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState<number>(modes["pomodoro"]);
  const [isActive, setIsActive] = useState<boolean>(false);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    if (
      isActive &&
      secondsLeft === 0 &&
      !hasSavedRef.current &&
      currentMode === "pomodoro"
    ) {
      setIsActive(false);
      hasSavedRef.current = true;

      const hours = Math.round((modes[currentMode] / 3600) * 100) / 100;
      saveStudyTime(hours);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, currentMode]);

  const handleModeChange = (mode: TimerMode): void => {
    setCurrentMode(mode);
    setIsActive(false);
    setSecondsLeft(modes[mode]);
  };

  const resetTimer = (): void => {
    setIsActive(false);
    setSecondsLeft(modes[currentMode]);
  };

  const fullScreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  async function saveStudyTime(hours: number) {
    if (!user?.sub) return;

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/users/${user.sub}/study-time`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hours }),
    });
  }

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center bg-cover bg-center font-sans text-white"
      style={{ backgroundImage: "url('/wallpaper_pomodoro.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex gap-4">
          {(Object.keys(modes) as TimerMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all shadow-lg border border-white/40 backdrop-blur-xl 
                ${currentMode === mode ? "bg-white/40 border-white/60" : "bg-white/20 hover:bg-white/30"}`}
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
            className="rounded-full bg-white/20 px-12 py-6 text-lg font-bold text-white backdrop-blur-md border border-white/40 hover:bg-white/30 transition-all shadow-md"
          >
            {isActive ? "pause" : "start"}
          </Button>

          <button
            onClick={resetTimer}
            className="opacity-90 hover:opacity-100 hover:scale-110 transition-transform"
          >
            <IconReload size={45} />
          </button>
        </div>
      </div>

      <div className="absolute right-10 flex h-full flex-col items-center justify-center py-10 z-20">
        <button
          onClick={fullScreen}
          className="mt-auto opacity-85 hover:opacity-100 hover:scale-110 transition-transform"
        >
          <IconMaximize size={60} />
        </button>
      </div>
    </div>
  );
}

export default Pomodoro;
