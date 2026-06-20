import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import TaskItem from '../TaskItem'
import { Task } from '@/types/Task.type'

const mockTask: Task = {
    id: '1',
    fecha: '19/6/2026',
    descripcion: 'Comprar leche',
    completada: false,
}

describe('TaskItem', () => {
    it('muestra la descripción de la tarea', async () => {
        const { getByText } = await render(<TaskItem task={mockTask} />)
        expect(getByText('Comprar leche')).toBeTruthy()
    })

    it('muestra la fecha de la tarea', async () => {
        const { getByText } = await render(<TaskItem task={mockTask} />)
        expect(getByText('19/6/2026')).toBeTruthy()
    })

    it('llama a completarTarea con el id al tocar Completar', async () => {
        const mockCompletar = jest.fn()
        const { getByText } = await render(
            <TaskItem task={mockTask} completarTarea={mockCompletar} />
        )
        fireEvent.press(getByText('Completar'))
        expect(mockCompletar).toHaveBeenCalledTimes(1)
        expect(mockCompletar).toHaveBeenCalledWith('1')
    })

    it('no muestra el botón Completar si no se pasa el callback', async () => {
        const { queryByText } = await render(<TaskItem task={mockTask} />)
        expect(queryByText('Completar')).toBeNull()
    })
})
