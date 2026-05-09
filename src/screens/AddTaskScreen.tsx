import { StackNavigationProp } from "@react-navigation/stack"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type AddTaskScreenProps ={
    navigation: StackNavigationProp<RootStackParamList>
}

const AddTaskScreen = ({navigation}: AddTaskScreenProps) => {

    const [tarea, setTarea] = useState<string>("")


    const handleAddTask = async () => {
        
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
        navigation.navigate("Home")
    }

    return (
        <View style={styles.container}>
            <Text>Agregar tarea</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Descripción de la tarea"
                value={tarea}
                onChangeText={setTarea}
            />
            <TouchableOpacity
                style={styles.touchable}
                onPress={handleAddTask}
            >
                <Text>Crear tarea</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#e4e4e4',
    },

    textInput: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 8,
        marginBottom: 8
    },

    touchable: {
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 8,
        marginBottom: 8,
    }
})

export default AddTaskScreen