import { validarDescripcion } from '../taskService'

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

describe('validarDescripcion', () => {
    it('retorna true para una descripción válida', () => {
        expect(validarDescripcion('Comprar leche')).toBe(true)
    })

    it('retorna false para una descripción vacía', () => {
        expect(validarDescripcion('')).toBe(false)
    })

    it('retorna false para una descripción con solo espacios', () => {
        expect(validarDescripcion('   ')).toBe(false)
    })

    it('retorna true para una descripción con espacios alrededor', () => {
        expect(validarDescripcion('  texto  ')).toBe(true)
    })
})
