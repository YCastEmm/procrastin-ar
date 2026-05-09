import { Usuario } from "@/types/User.type"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SESION_KEY = "sesion"

export const guardarUsuario = async (usuario: string, contraseña: string): Promise<void> => {
    await AsyncStorage.setItem("usuario", JSON.stringify({ usuario, contraseña }))
}

export const verificarUsuario = async (usuario: string, contraseña: string): Promise<boolean | null> => {
    const stored = await AsyncStorage.getItem("usuario")
    if (!stored) return null
    const parsedUser: Usuario = JSON.parse(stored)
    if (usuario === parsedUser.usuario && contraseña === parsedUser.contraseña) {
        return true
    }
    return false
}

export const iniciarSesion = async (usuario: string): Promise<void> => {
    await AsyncStorage.setItem(SESION_KEY, JSON.stringify({ usuario }))
}

export const cerrarSesion = async (): Promise<void> => {
    await AsyncStorage.removeItem(SESION_KEY)
}

export const estaLogueado = async (): Promise<boolean> => {
    const stored = await AsyncStorage.getItem(SESION_KEY)
    return stored !== null
}