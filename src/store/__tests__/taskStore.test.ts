import { useTaskStore } from '../taskStore'
import { getTareas, saveTareas, eliminarTarea } from '@/services/taskService'
import { Task } from '@/types/Task.type'

jest.mock('@/services/taskService', () => ({
    getTareas: jest.fn(),
    saveTareas: jest.fn(),
    completarTarea: jest.fn(),
    eliminarTarea: jest.fn(),
    limpiarCompletadas: jest.fn(),
    validarDescripcion: jest.fn(),
}))

jest.mock('expo-calendar', () => ({
    deleteEventAsync: jest.fn(),
    getCalendarsAsync: jest.fn(),
    getDefaultCalendarAsync: jest.fn(),
    EntityTypes: { EVENT: 'event' },
}))

const mockTask: Task = {
    id: '1',
    fecha: '19/6/2026',
    descripcion: 'Test task',
    completada: false,
}

beforeEach(() => {
    useTaskStore.setState({ tasks: [] })
    jest.clearAllMocks()
})

describe('taskStore', () => {
    it('addTask agrega una tarea al estado', async () => {
        ;(getTareas as jest.Mock).mockResolvedValue([])
        ;(saveTareas as jest.Mock).mockResolvedValue(undefined)

        await useTaskStore.getState().addTask(mockTask)

        expect(useTaskStore.getState().tasks).toHaveLength(1)
        expect(useTaskStore.getState().tasks[0].descripcion).toBe('Test task')
    })

    it('addTask llama a saveTareas con la nueva tarea', async () => {
        ;(getTareas as jest.Mock).mockResolvedValue([])
        ;(saveTareas as jest.Mock).mockResolvedValue(undefined)

        await useTaskStore.getState().addTask(mockTask)

        expect(saveTareas).toHaveBeenCalledWith([mockTask])
    })

    it('deleteTask remueve la tarea del estado', async () => {
        useTaskStore.setState({ tasks: [mockTask] })
        ;(eliminarTarea as jest.Mock).mockResolvedValue([])

        await useTaskStore.getState().deleteTask('1')

        expect(useTaskStore.getState().tasks).toHaveLength(0)
    })

    it('deleteTask llama a eliminarTarea con el id correcto', async () => {
        useTaskStore.setState({ tasks: [mockTask] })
        ;(eliminarTarea as jest.Mock).mockResolvedValue([])

        await useTaskStore.getState().deleteTask('1')

        expect(eliminarTarea).toHaveBeenCalledWith('1')
    })
})
