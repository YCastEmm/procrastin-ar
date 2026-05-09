import { Usuario } from "@/types/User.type"
import AsyncStorage from "@react-native-async-storage/async-storage"

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