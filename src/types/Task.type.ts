

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
    calendarEventId?: string
    prioridad?: 'alta' | 'media' | 'baja'
}