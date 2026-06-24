import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconPlus, IconChecklist, IconX, IconDots, IconTrash } from "@tabler/icons-react";
import { checklistService, type ChecklistItem } from "../services/checklistService";

export function TaskChecklist({
  showFloatingButton = false,
  onClose,
}: {
  showFloatingButton?: boolean;
  onClose?: () => void;
}) {
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // carrega as tarefas do backend
  useEffect(() => {
    checklistService.getAll()
      .then(setTasks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // fecha menu ao clicar fora
  useEffect(() => {
    if (!openMenuId) return;
    function handler(e: MouseEvent) {
      const ref = menuRefs.current[openMenuId!];
      if (ref && !ref.contains(e.target as Node)) setOpenMenuId(null);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenuId]);

  async function toggleTask(id: string) {
    // otimista
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
    try {
      const updated = await checklistService.toggle(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      // reverte
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      );
    }
  }

  async function addTask() {
    if (!newTask.trim() || adding) return;
    setAdding(true);
    const text = newTask.trim();
    setNewTask("");
    try {
      const created = await checklistService.create(text);
      setTasks((prev) => [created, ...prev]);
    } catch {
      setNewTask(text); // restaura se falhar
    } finally {
      setAdding(false);
    }
  }

  async function deleteTask(id: string) {
    setOpenMenuId(null);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await checklistService.remove(id);
    } catch {
      // se falhar, recarrega do servidor
      checklistService.getAll().then(setTasks).catch(() => {});
    }
  }

  const content = (
    <div className="flex flex-col gap-4">
      {/* INPUT */}
      <div className="flex gap-2">
        <Input
          placeholder="Nova tarefa..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTask();
            }
          }}
          disabled={adding}
          className="rounded-lg border-[#b7bb86]/60 bg-white focus-visible:ring-[#b7bb86]/50 focus-visible:border-[#b7bb86] placeholder:text-gray-400 text-sm"
        />
        <Button
          onClick={addTask}
          disabled={adding || !newTask.trim()}
          className="rounded-full shrink-0 bg-[#b7bb86] hover:bg-[#a0a46e] text-white disabled:opacity-50"
        >
          <IconPlus size={18} />
        </Button>
      </div>

      {/* LISTA */}
      <div className="flex flex-col gap-1">
        {loading && (
          <p className="text-xs text-[#b7bb86]/70 text-center py-2">Carregando...</p>
        )}
        {!loading && tasks.length === 0 && (
          <p className="text-xs text-[#b7bb86]/70 text-center py-2">Nenhuma tarefa ainda</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#b7bb86]/15 transition-colors"
          >
            <Checkbox
              checked={task.done}
              onCheckedChange={() => toggleTask(task.id)}
              className="shrink-0 border-[#b7bb86] data-[state=checked]:bg-[#b7bb86] data-[state=checked]:border-[#b7bb86] data-[state=checked]:ring-1 data-[state=checked]:ring-gray-500"
            />
            <span
              className={`flex-1 text-sm truncate ${
                task.done ? "line-through text-gray-400" : "text-gray-700"
              }`}
            >
              {task.content}
            </span>

            {/* MENU 3 PONTOS */}
            <div
              ref={(el) => { menuRefs.current[task.id] = el; }}
              className="relative shrink-0"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId((prev) => (prev === task.id ? null : task.id));
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full
                           text-[#b7bb86]/60 hover:text-[#b7bb86] hover:bg-[#b7bb86]/20
                           opacity-0 group-hover:opacity-100 transition-all"
              >
                <IconDots size={14} />
              </button>

              {openMenuId === task.id && (
                <div className="absolute right-0 top-7 z-50 min-w-[140px] rounded-xl
                                border border-gray-100 bg-white shadow-lg py-1 overflow-hidden">
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm
                               text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <IconTrash size={13} />
                    Deletar nota
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* CARD — desktop e modal */}
      <div className="w-full rounded-2xl p-4 shadow flex flex-col gap-4 bg-white border border-[#b7bb86]/30">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#b7bb86]">Lista de Tarefas</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#b7bb86]/20 transition-colors"
            >
              <IconX size={16} className="text-[#b7bb86]" />
            </button>
          )}
        </div>
        {content}
      </div>

      {/* DRAWER MOBILE — botão flutuante */}
      {showFloatingButton && (
        <>
          <button
            onClick={() => setDrawerOpen(true)}
            className="xl:hidden fixed left-4 bottom-24 md:bottom-6 z-40 w-12 h-12 rounded-full
                       bg-[#b7bb86] text-white shadow-lg flex items-center justify-center
                       hover:bg-[#a0a46e] transition-colors"
          >
            <IconChecklist size={22} />
          </button>

          <div
            className={`xl:hidden fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300
                        ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => setDrawerOpen(false)}
          />

          <div
            className={`xl:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl
                        shadow-2xl transition-transform duration-300
                        ${drawerOpen ? "translate-y-0" : "translate-y-full"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#b7bb86]/20">
              <h2 className="font-semibold text-[#b7bb86]">Lista de Tarefas</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#b7bb86]/20 transition-colors"
              >
                <IconX size={18} className="text-[#b7bb86]" />
              </button>
            </div>
            <div className="px-5 py-4 pb-8 max-h-[60vh] overflow-y-auto scrollbar-none">
              {content}
            </div>
          </div>
        </>
      )}
    </>
  );
}
