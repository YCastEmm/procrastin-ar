import { StackNavigationProp } from "@react-navigation/stack"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { programarRecordatorio } from "@/services/notificationsService"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { SafeAreaView } from 'react-native-safe-area-context'


type AddTaskScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const AddTaskScreen = ({ navigation }: AddTaskScreenProps) => {

    const [tarea, setTarea] = useState<string>("")
    const [horaElegida, setHoraElegida] = useState<Date>(new Date())


    const abrirPicker = () => {
        DateTimePickerAndroid.open({
            value: horaElegida,
            mode: 'time',
            is24Hour: true,
            onChange: (event, selectedDate) => {
                if (selectedDate) setHoraElegida(selectedDate)
            }
        })
    }

    const handleAddTask = async () => {

        try {
        const storedTasks = await AsyncStorage.getItem("tareas")
        const listaTareas = storedTasks ? JSON.parse(storedTasks) : []
        const nuevaTarea = {
            id: Date.now().toString(),
            fecha: new Date().toLocaleDateString('es-AR'),
            descripcion: tarea,
            completada: false,
        }
        listaTareas.push(nuevaTarea)
        await AsyncStorage.setItem("tareas", JSON.stringify(listaTareas))
        await programarRecordatorio(tarea, horaElegida)
        navigation.navigate("Home")
    } catch (error) {
        console.error(error)
    }
    }

    return (
        <SafeAreaView  style={styles.container}>
            <Text>Agregar tarea</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Descripción de la tarea"
                value={tarea}
                onChangeText={setTarea}
            />
            <TouchableOpacity style={styles.touchable} onPress={abrirPicker}>
                <Text>Hora del recordatorio: {horaElegida.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.touchable}
                onPress={handleAddTask}
            >
                <Text>Crear tarea</Text>
            </TouchableOpacity>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingBottom: 40,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    textInput: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    touchable: {
        backgroundColor: '#208AEF',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
})

export default AddTaskScreen