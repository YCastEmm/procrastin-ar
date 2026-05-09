import { StackNavigationProp } from "@react-navigation/stack"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useEffect, useState } from "react"
import { Task } from "@/types/Task.type"
import TaskItem from "@/components/TaskItem"
import { completarTarea, eliminarTarea, getTareas } from "@/services/taskService"
import { pedirPermisos } from "@/services/notificationsService"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, typography } from "@/theme"

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {

    const [listaTareas, setListaTareas] = useState<Task[]>([])

    const cargarTareas = async () => {
        const tareas = await getTareas()
        setListaTareas(tareas)
    }

    useEffect(() => {
        cargarTareas()
        pedirPermisos()
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
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Home</Text>

            <Text style={styles.sectionHeader}>Pendientes</Text>
            <FlatList
                style={styles.list}
                data={listaTareas?.filter((task) => task.completada === false)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<TaskItem task={item} completarTarea={handleCompletar} eliminarTarea={handleEliminar} />)}
            />

            <Text style={styles.sectionHeader}>Completadas</Text>
            <FlatList
                style={styles.list}
                data={listaTareas?.filter((task) => task.completada === true)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<TaskItem task={item} />)}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AddTask")}
            >
                <Text style={styles.addButtonText}>+ Agregar tarea</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    title: {
        fontSize: typography.title,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.lg,
    },
    sectionHeader: {
        fontSize: typography.sectionHeader,
        fontWeight: '600',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    list: {
        flexGrow: 0,
    },
    addButton: {
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        marginTop: spacing.lg,
    },
    addButtonText: {
        fontSize: typography.body,
        color: colors.primary,
        fontWeight: '500',
    },
})

export default HomeScreen
