import * as Notifications from 'expo-notifications'

export const cargarPermisoNotificaciones = async () => {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') {
        alert('Se necesitan permisos para las notificaciones')
    }
}