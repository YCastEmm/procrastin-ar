import { StackNavigationProp } from "@react-navigation/stack"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useEffect, useState } from "react"
import { Task } from "@/types/Task.type"
import AsyncStorage from "@react-native-async-storage/async-storage"
import TaskItem from "@/components/TaskItem"

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList> // recibe navigation como prop que viene del stack.navigator
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {

    const [listaTareas, setListaTareas] = useState<Task[]>([])

    useEffect(() => {
        const cargarTareas = async () => {
            const stored = await AsyncStorage.getItem("tareas")
            if (stored) {
                setListaTareas(JSON.parse(stored))
            }
        }
        cargarTareas()
    }, [])


    const completarTarea = async (id: string) => {
        const listaActualizada = listaTareas?.map((item) => 
            item.id === id ? {...item, completada: true } : item
        )
        setListaTareas(listaActualizada)
        await AsyncStorage.setItem("tareas", JSON.stringify(listaActualizada))
    }

    const eliminarTarea = async (id: string) => {
        const listaActualizada = listaTareas?.filter((item) => item.id !== id)
        setListaTareas(listaActualizada)
        await AsyncStorage.setItem("tareas", JSON.stringify(listaActualizada))
    }


    return (
        <View style={styles.container}>
            <Text>Home</Text>

            <Text>Lista de tareas pendientes</Text>
            <FlatList
                data={listaTareas?.filter((task) => task.completada === false)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<TaskItem task={item} completarTarea={completarTarea} eliminarTarea={eliminarTarea} />)}
            />


            <Text>Completadas</Text>
            <FlatList
                data={listaTareas?.filter((task) => task.completada === true)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<TaskItem task={item} />)}
            />


            <TouchableOpacity
                onPress={() => navigation.navigate("AddTask")}
            >
                <Text>Agregar tarea</Text>
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

export default HomeScreen