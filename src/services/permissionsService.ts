import { Alert } from 'react-native'
import { Camera } from 'expo-camera'
import * as Notifications from 'expo-notifications'
import { requestMediaLibraryPermissionsAsync } from 'expo-image-picker'
import { requestForegroundPermissionsAsync } from 'expo-location'
import * as Contacts from 'expo-contacts'
import * as Calendar from 'expo-calendar'

type PermissionResult = 'granted' | 'denied' | 'undetermined'

const alertDenegado = (titulo: string, detalle: string) =>
    Alert.alert(titulo, detalle, [{ text: 'Entendido' }])

export const requestCameraPermission = async (): Promise<PermissionResult> => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    if (status === 'denied') {
        alertDenegado(
            'Permiso de cámara denegado',
            'Sin acceso a la cámara no vas a poder sacar fotos para tus tareas.'
        )
    }
    return status as PermissionResult
}

export const requestMediaLibraryPermission = async (): Promise<PermissionResult> => {
    const { status } = await requestMediaLibraryPermissionsAsync()
    if (status === 'denied') {
        alertDenegado(
            'Permiso de galería denegado',
            'Sin acceso a la galería no vas a poder adjuntar fotos existentes a tus tareas.'
        )
    }
    return status as PermissionResult
}

export const requestLocationPermission = async (): Promise<PermissionResult> => {
    const { status } = await requestForegroundPermissionsAsync()
    if (status === 'denied') {
        alertDenegado(
            'Permiso de ubicación denegado',
            'Sin acceso a la ubicación no vas a poder guardar el lugar donde creaste la tarea.'
        )
    }
    return status as PermissionResult
}

export const requestContactsPermission = async (): Promise<PermissionResult> => {
    const { status } = await Contacts.requestPermissionsAsync()
    if (status === 'denied') {
        alertDenegado(
            'Permiso de contactos denegado',
            'Sin acceso a los contactos no vas a poder vincular personas a tus tareas.'
        )
    }
    return status as PermissionResult
}

export const requestNotificationsPermission = async (): Promise<PermissionResult> => {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status === 'denied') {
        alertDenegado(
            'Permiso de notificaciones denegado',
            'Sin este permiso no vas a recibir recordatorios de tus tareas.'
        )
    }
    return status as PermissionResult
}

export const requestCalendarPermission = async (): Promise<PermissionResult> => {
    const { status } = await Calendar.requestCalendarPermissionsAsync()
    if (status === 'denied') {
        alertDenegado(
            'Permiso de calendario denegado',
            'Sin acceso al calendario no vas a poder crear eventos para tus tareas.'
        )
    }
    return status as PermissionResult
}
