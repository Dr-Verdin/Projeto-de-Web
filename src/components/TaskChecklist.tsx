import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { IconPlus } from "@tabler/icons-react";

import type { Task } from "../types/Task";

export function TaskChecklist() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Estudar React", done: false },
    { id: "2", text: "Fazer atividade de redes", done: true },
  ]);

  const [newTask, setNewTask] = useState("");

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  function addTask() {
    if (!newTask.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask,
      done: false,
    };

    setTasks((prev) => [task, ...prev]);
    setNewTask("");
  }

  return (
    <div className="rounded-2xl p-4 shadow flex flex-col gap-4 overflow-hidden bg-gray-50">
      <h2 className="font-semibold text-slate-900 text-[#e1903e]">Lista de Tarefas</h2>

      <div className="flex">
        <Input
          placeholder="Nova tarefa..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="opacity-30 focus:opacity-100 transition-opacity rounded-md"
        />
        <Button onClick={addTask} className="hover:bg-slate-300 rounded-full">
          <IconPlus size={18} />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <label
            key={task.id}
            className="flex items-center gap-2 cursor-pointer text-sm p-2 rounded-md hover:bg-[#aadeff]/20 transition-colors"
          >
            <Checkbox
              checked={task.done}
              onCheckedChange={() => toggleTask(task.id)}
            />
            <span className={task.done ? "line-through text-gray-400" : ""}>
              {task.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
