import { create } from 'zustand'
import { Usuario } from '@/types/User.type'
import {
    guardarUsuario,
    verificarUsuario,
    iniciarSesion,
    cerrarSesion,
} from '@/services/authService'

interface AuthStore {
    usuario: Usuario | null
    login: (usuario: string, contraseña: string) => Promise<boolean | null>
    logout: () => Promise<void>
    register: (usuario: string, contraseña: string) => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
    usuario: null,

    login: async (usuario: string, contraseña: string) => {
        const result = await verificarUsuario(usuario, contraseña)
        if (result === true) {
            await iniciarSesion(usuario)
            set({ usuario: { usuario, contraseña } })
        }
        return result
    },

    logout: async () => {
        await cerrarSesion()
        set({ usuario: null })
    },

    register: async (usuario: string, contraseña: string) => {
        await guardarUsuario(usuario, contraseña)
    },
}))
