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
import { Plus, LogOut, Trash2, ClipboardList, CheckCheck } from "lucide-react-native"

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

    const pendientes = tasks.filter(t => !t.completada)
    const completadas = tasks.filter(t => t.completada)

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.appTitle}>
                    Procrastin<Text style={styles.appTitleBold}>AR</Text>
                </Text>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Pendientes</Text>
                    {pendientes.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{pendientes.length}</Text>
                        </View>
                    )}
                </View>
                <FlatList
                    style={styles.list}
                    data={pendientes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TaskItem
                            task={item}
                            completarTarea={(id) => toggleComplete(id)}
                            eliminarTarea={(id) => deleteTask(id)}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <ClipboardList size={32} color={colors.border} />
                            <Text style={styles.emptyText}>No tenés tareas pendientes</Text>
                        </View>
                    }
                />

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Completadas</Text>
                    {completadas.length > 0 && (
                        <>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{completadas.length}</Text>
                            </View>
                            <TouchableOpacity style={styles.clearButton} onPress={clearCompleted}>
                                <Trash2 size={13} color={colors.textMuted} />
                                <Text style={styles.clearText}>Limpiar</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                <FlatList
                    style={styles.list}
                    data={completadas}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TaskItem task={item} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <CheckCheck size={32} color={colors.border} />
                            <Text style={styles.emptyText}>Nada completado aún</Text>
                        </View>
                    }
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

                <TouchableOpacity
                    style={globalStyles.secondaryButton}
                    onPress={async () => {
                        await logout()
                        navigation.replace("Login")
                    }}
                >
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    badge: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 1,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textMuted,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginLeft: 'auto',
    },
    clearText: {
        fontSize: typography.caption,
        fontWeight: '500',
        color: colors.textMuted,
    },
    list: {
        flexGrow: 0,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        gap: spacing.xs,
    },
    emptyTitle: {
        fontSize: typography.body,
        fontWeight: '600',
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    emptyText: {
        fontSize: typography.caption,
        color: colors.textMuted,
    },
    bottomButtons: {
        paddingTop: spacing.md,
        gap: spacing.sm,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
})

export default HomeScreen
