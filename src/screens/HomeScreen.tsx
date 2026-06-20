import { StackNavigationProp } from "@react-navigation/stack"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useEffect } from "react"
import TaskItem from "@/components/TaskItem"
import { pedirPermisos } from "@/services/notificationsService"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, typography } from "@/themes/theme"
import { globalStyles } from "@/themes/styles"
import { useTaskStore } from "@/store/taskStore"
import { useAuthStore } from "@/store/authStore"
import { Plus, LogOut, Trash2 } from "lucide-react-native"

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {

    const { tasks, loadTasks, toggleComplete, deleteTask, clearCompleted } = useTaskStore()
    const { logout } = useAuthStore()

    useEffect(() => {
        loadTasks()
        pedirPermisos()
    }, [])

    const handleCompletar = async (id: string) => {
        await toggleComplete(id)
    }

    const handleEliminar = async (id: string) => {
        await deleteTask(id)
    }

    const handleLimpiarCompletadas = async () => {
        await clearCompleted()
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
                    data={tasks?.filter((task) => task.completada === false)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (<TaskItem task={item} completarTarea={handleCompletar} eliminarTarea={handleEliminar} />)}
                    ListEmptyComponent={<Text style={styles.emptyText}>No tenés tareas pendientes</Text>}
                />

                <View style={styles.sectionRow}>
                    <Text style={styles.sectionHeader}>Completadas</Text>
                    {tasks.some(t => t.completada) && (
                        <TouchableOpacity style={styles.clearButton} onPress={handleLimpiarCompletadas}>
                            <Trash2 size={13} color={colors.textMuted} />
                            <Text style={styles.clearText}>Limpiar</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <FlatList
                    style={styles.list}
                    data={tasks?.filter((task) => task.completada === true)}
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
                    <View style={styles.buttonContent}>
                        <Plus size={18} color="#fff" />
                        <Text style={globalStyles.primaryButtonText}>Agregar tarea</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.secondaryButton}
                    onPress={async () => {
                        await logout()
                        navigation.replace("Login")
                    }}>
                    <View style={styles.buttonContent}>
                        <LogOut size={16} color={colors.primary} />
                        <Text style={globalStyles.secondaryButtonText}>Cerrar sesión</Text>
                    </View>
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
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginTop: spacing.md,
    },
    clearButton: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        marginBottom: spacing.sm,
    },
    clearText: {
        fontSize: typography.caption, fontWeight: '500',
        color: colors.textMuted,
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
    buttonContent: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    },
})

export default HomeScreen
