import { StackNavigationProp } from "@react-navigation/stack"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useEffect, useState } from "react"
import { Task } from "@/types/Task.type"
import TaskItem from "@/components/TaskItem"
import { completarTarea, eliminarTarea, limpiarCompletadas, getTareas } from "@/services/taskService"
import { pedirPermisos } from "@/services/notificationsService"
import { cerrarSesion } from "@/services/authService"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, typography } from "@/themes/theme"
import { globalStyles } from "@/themes/styles"

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

    const handleLimpiarCompletadas = async () => {
        const pendientes = await limpiarCompletadas()
        setListaTareas(pendientes)
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.appTitle}>
                    Procrastin<Text style={styles.appTitleBold}>AR</Text>
                </Text>

                <Text style={styles.sectionHeader}>Pendientes</Text>
                <FlatList
                    style={styles.list}
                    data={listaTareas?.filter((task) => task.completada === false)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (<TaskItem task={item} completarTarea={handleCompletar} eliminarTarea={handleEliminar} />)}
                    ListEmptyComponent={<Text style={styles.emptyText}>No tenés tareas pendientes</Text>}
                />

                <View style={styles.sectionRow}>
                    <Text style={styles.sectionHeader}>Completadas</Text>
                    {listaTareas.some(t => t.completada) && (
                        <TouchableOpacity onPress={handleLimpiarCompletadas}>
                            <Text style={styles.clearText}>Limpiar</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <FlatList
                    style={styles.list}
                    data={listaTareas?.filter((task) => task.completada === true)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (<TaskItem task={item} />)}
                    ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas completadas</Text>}
                />
            </View>

            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={globalStyles.primaryButton}
                    onPress={() => navigation.navigate("AddTask")}
                >
                    <Text style={globalStyles.primaryButtonText}>+ Agregar tarea</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.secondaryButton}
                    onPress={async () => {
                        await cerrarSesion()
                        navigation.replace("Login")
                    }}>
                    <Text style={globalStyles.secondaryButtonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
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
    content: {
        flex: 1,
    },
    appTitle: {
        fontSize: 36, fontWeight: '300', color: colors.text,
        marginBottom: spacing.lg,
    },
    appTitleBold: {
        fontWeight: '800', color: colors.primary,
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
    sectionRow: {
        flexDirection: 'row', alignItems: 'baseline',
        justifyContent: 'space-between', marginTop: spacing.md,
    },
    clearText: {
        fontSize: typography.caption, fontWeight: '600',
        color: colors.primary, marginBottom: spacing.sm,
    },
    list: {
        flexGrow: 0,
    },
    emptyText: {
        fontSize: typography.body, color: colors.textMuted,
        fontStyle: 'italic', paddingVertical: spacing.sm,
    },
    bottomButtons: {
        paddingTop: spacing.md, gap: spacing.sm,
    },
})

export default HomeScreen
