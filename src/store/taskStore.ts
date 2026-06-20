import { create } from 'zustand'
import { Task } from '@/types/Task.type'
import {
    getTareas,
    saveTareas,
    completarTarea,
    eliminarTarea,
    limpiarCompletadas,
} from '@/services/taskService'

interface TaskStore {
    tasks: Task[]
    loadTasks: () => Promise<void>
    addTask: (task: Task) => Promise<void>
    updateTask: (task: Task) => Promise<void>
    deleteTask: (id: string) => Promise<void>
    toggleComplete: (id: string) => Promise<void>
    clearCompleted: () => Promise<void>
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],

    loadTasks: async () => {
        const tasks = await getTareas()
        set({ tasks })
    },

    addTask: async (task: Task) => {
        const current = await getTareas()
        const updated = [...current, task]
        await saveTareas(updated)
        set({ tasks: updated })
    },

    updateTask: async (task: Task) => {
        const current = await getTareas()
        const updated = current.map((t: Task) => (t.id === task.id ? task : t))
        await saveTareas(updated)
        set({ tasks: updated })
    },

    deleteTask: async (id: string) => {
        const updated = await eliminarTarea(id)
        set({ tasks: updated })
    },

    toggleComplete: async (id: string) => {
        const updated = await completarTarea(id)
        set({ tasks: updated })
    },

    clearCompleted: async () => {
        const updated = await limpiarCompletadas()
        set({ tasks: updated })
    },
}))
