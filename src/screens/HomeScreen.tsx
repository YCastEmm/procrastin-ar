import { StackNavigationProp } from "@react-navigation/stack"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useEffect, useState } from "react"
import { Task } from "@/types/Task.type"
import TaskItem from "@/components/TaskItem"
import { completarTarea, eliminarTarea, getTareas } from "@/services/taskService"
import { cargarPermisoNotificaciones } from "@/services/notificationsService"

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList> // recibe navigation como prop que viene del stack.navigator
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {

    const [listaTareas, setListaTareas] = useState<Task[]>([])

    const cargarTareas = async () => {
        const tareas = await getTareas()
        setListaTareas(tareas)
    }

    useEffect(() => {
        cargarTareas()
        cargarPermisoNotificaciones()
    }, [])


    const handleCompletar = async (id: string) => {
        const actualizadas = await completarTarea(id)
        setListaTareas(actualizadas)
    }

    const handleEliminar = async (id: string) => {
        const actualizadas = await eliminarTarea(id)
        setListaTareas(actualizadas)
    }


    return (
        <View style={styles.container}>
            <Text>Home</Text>

            <Text>Lista de tareas pendientes</Text>
            <FlatList
                data={listaTareas?.filter((task) => task.completada === false)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<TaskItem task={item} completarTarea={handleCompletar} eliminarTarea={handleEliminar} />)}
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