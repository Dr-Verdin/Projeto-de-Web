import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconPlus, IconChecklist, IconX } from "@tabler/icons-react";
import type { Task } from "../types/Task";

export function TaskChecklist({ showFloatingButton = false }: { showFloatingButton?: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Estudar React", done: false },
    { id: "2", text: "Fazer atividade de redes", done: true },
  ]);
  const [newTask, setNewTask] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  }

  function addTask() {
    if (!newTask.trim()) return;
    setTasks((prev) => [{ id: crypto.randomUUID(), text: newTask, done: false }, ...prev]);
    setNewTask("");
  }

  const content = (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Nova tarefa..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addTask(); }}
          className="opacity-70 focus:opacity-100 transition-opacity rounded-md"
        />
        <Button onClick={addTask} className="hover:bg-slate-300 rounded-full shrink-0">
          <IconPlus size={18} />
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <label key={task.id} className="flex items-center gap-2 cursor-pointer text-sm p-2 rounded-md hover:bg-[#aadeff]/20 transition-colors">
            <Checkbox checked={task.done} onCheckedChange={() => toggleTask(task.id)} />
            <span className={task.done ? "line-through text-gray-400" : ""}>{task.text}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* VERSÃO DESKTOP — card fixo na coluna direita */}
      <div className="w-full rounded-2xl p-4 shadow flex flex-col gap-4 bg-gray-50">
        <h2 className="font-semibold text-[#e1903e]">Lista de Tarefas</h2>
        {content}
      </div>

      {/* VERSÃO MOBILE — botão flutuante + drawer (só aparece quando showFloatingButton=true) */}
      {showFloatingButton && (
        <>
          <button
            onClick={() => setDrawerOpen(true)}
            className="xl:hidden fixed left-4 bottom-24 md:bottom-6 z-40 w-12 h-12 rounded-full bg-[#e1903e] text-white shadow-lg flex items-center justify-center hover:bg-[#e1903e]/80 transition-colors"
          >
            <IconChecklist size={22} />
          </button>

          <div
            className={`xl:hidden fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => setDrawerOpen(false)}
          />

          <div className={`xl:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${drawerOpen ? "translate-y-0" : "translate-y-full"}`}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
              <h2 className="font-semibold text-[#e1903e]">Lista de Tarefas</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                <IconX size={18} className="text-gray-500" />
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
