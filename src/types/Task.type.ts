

export interface Task {
    id: string
    fecha: string
    descripcion: string
    completada: boolean
    fotoUri?: string
    ubicacion?: {
        lat: number
        lng: number
        direccion?: string
    }
    contacto?: {
        nombre: string
        telefono?: string
    }
    hora?: string
    timestamp?: number
    calendarEventId?: string
    notificationId?: string
    prioridad?: 'alta' | 'media' | 'baja'
}
