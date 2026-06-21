import { create } from 'zustand'
import { Task } from '@/types/Task.type'
import {
    getTareas,
    saveTareas,
    completarTarea,
    eliminarTarea,
    limpiarCompletadas,
} from '@/services/taskService'
import { sincronizarNotificaciones } from '@/services/notificationsService'
import * as Calendar from 'expo-calendar'
import * as Notifications from 'expo-notifications'

interface TaskStore {
    tasks: Task[]
    loadTasks: () => Promise<void>
    addTask: (task: Task) => Promise<void>
    updateTask: (task: Task) => Promise<void>
    deleteTask: (id: string) => Promise<void>
    toggleComplete: (id: string) => Promise<void>
    clearCompleted: () => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],

    loadTasks: async () => {
        const tasks = await getTareas()
        const sincronizadas = await sincronizarNotificaciones(tasks)
        await saveTareas(sincronizadas)
        set({ tasks: sincronizadas })
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
        const task = get().tasks.find(t => t.id === id)
        if (task?.calendarEventId) {
            try {
                await Calendar.deleteEventAsync(task.calendarEventId)
            } catch {}
        }
        const updated = await eliminarTarea(id)
        set({ tasks: updated })
    },

    toggleComplete: async (id: string) => {
        const task = get().tasks.find(t => t.id === id)
        if (task && !task.completada && task.notificationId) {
            try {
                await Notifications.cancelScheduledNotificationAsync(task.notificationId)
            } catch {}
        }
        const updated = await completarTarea(id)
        set({ tasks: updated })
    },

    clearCompleted: async () => {
        const updated = await limpiarCompletadas()
        set({ tasks: updated })
    },
}))
