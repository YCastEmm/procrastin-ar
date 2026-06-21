import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { requestNotificationsPermission } from '@/services/permissionsService'
import { Task } from '@/types/Task.type'

export const CHANNEL_ID = 'recordatorios'

export const configurarCanalAndroid = async (): Promise<void> => {
    if (Platform.OS !== 'android') return
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Recordatorios',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    })
}

export const pedirPermisos = async (): Promise<boolean> => {
    const status = await requestNotificationsPermission()
    if (status !== 'granted') return false
    return true
}

// Devuelve el momento (Date) de la tarea: usa timestamp si existe, si no parsea fecha/hora.
const obtenerFechaHora = (task: Task): Date | null => {
    if (typeof task.timestamp === 'number') return new Date(task.timestamp)
    if (!task.fecha || !task.hora) return null
    const [dia, mes, anio] = task.fecha.split('/')
    const [hh, mm] = task.hora.split(':')
    const fechaHora = new Date(+anio, +mes - 1, +dia, +hh, +mm, 0, 0)
    return isNaN(fechaHora.getTime()) ? null : fechaHora
}

export const sincronizarNotificaciones = async (tasks: Task[]): Promise<Task[]> => {
    const ahora = new Date()
    return Promise.all(tasks.map(async (task) => {
        // Cancelar solo la notificación de ESTA tarea (no tocar otras ni la de prueba).
        if (task.notificationId) {
            try {
                await Notifications.cancelScheduledNotificationAsync(task.notificationId)
            } catch {}
        }
        if (task.completada) return { ...task, notificationId: undefined }
        const fechaHora = obtenerFechaHora(task)
        if (!fechaHora || fechaHora <= ahora) return { ...task, notificationId: undefined }
        const notificationId = await programarRecordatorio(task.descripcion, fechaHora) ?? undefined
        return { ...task, notificationId }
    }))
}

export const programarRecordatorio = async (descripcion: string, fechaHora: Date): Promise<string | null> => {
    if (fechaHora.getTime() <= Date.now()) return null

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: descripcion,
            body: "Recordatorio",
            sound: 'default',
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: fechaHora,
            channelId: CHANNEL_ID,
        }
    })
    return id
}
