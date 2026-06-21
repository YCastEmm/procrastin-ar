import * as Notifications from 'expo-notifications'
import { requestNotificationsPermission } from '@/services/permissionsService'
import { Task } from '@/types/Task.type'

export const pedirPermisos = async (): Promise<boolean> => {
    const status = await requestNotificationsPermission()
    if (status !== 'granted') return false
    return true
}

export const sincronizarNotificaciones = async (tasks: Task[]): Promise<Task[]> => {
    await Notifications.cancelAllScheduledNotificationsAsync()
    const ahora = new Date()
    return Promise.all(tasks.map(async (task) => {
        if (task.completada || !task.fecha || !task.hora) return task
        const [dia, mes, anio] = task.fecha.split('/')
        const [hh, mm] = task.hora.split(':')
        const fechaHora = new Date(+anio, +mes - 1, +dia, +hh, +mm, 0, 0)
        if (fechaHora <= ahora) return { ...task, notificationId: undefined }
        const notificationId = await programarRecordatorio(task.descripcion, fechaHora) ?? undefined
        return { ...task, notificationId }
    }))
}

export const programarRecordatorio = async (descripcion: string, fechaHora: Date): Promise<string | null> => {
    const ahora = new Date()
    const segundos = Math.floor((fechaHora.getTime() - ahora.getTime()) / 1000)
    if (segundos <= 0) return null

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: descripcion,
            body: "Recordatorio",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: segundos,
        }
    })
    return id
}
