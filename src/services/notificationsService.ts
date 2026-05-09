import * as Notifications from 'expo-notifications'


// concede los permisos para usar notificaiones
export const pedirPermisos = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') return false
    await notificarTareasPendientes()
    return true
}

// genera un recordartorio de la tarea con una hora de recordatorio
export const programarRecordatorio = async (descripcion: string, hora: Date): Promise<void> => {
    const ahora = new Date()
    const trigger = new Date(ahora)
    trigger.setHours(hora.getHours(), hora.getMinutes(), 0, 0)
    
    // si la hora ya paso hoy, programar para mañana
    if (trigger <= ahora) {
        trigger.setDate(trigger.getDate() + 1)
    }

    const segundos = Math.floor((trigger.getTime() - ahora.getTime()) / 1000)

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Nudge",
            body: `Recordatorio: "${descripcion}" sigue pendiente`,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: segundos,
        }
    })
}

// genera una notificacion para invitar al usuario a revisar las tareas pendientes
export const notificarTareasPendientes = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Nudge",
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