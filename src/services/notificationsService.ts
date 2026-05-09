import * as Notifications from 'expo-notifications'

export const pedirPermisos = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') return false
    await notificarTareasPendientes()
    return true
}


export const notificarTareaCreada = async (descripcion: string) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Nudge 📋",
            body: `Nueva tarea creada: ${descripcion}`,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5
        }
    })
}

export const notificarTareasPendientes = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Nudge 📋",
            body: "Revisá tus tareas pendientes!",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: 9,
            minute: 0,
            repeats: true
        }
    })
}