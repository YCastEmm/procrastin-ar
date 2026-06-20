import { StackNavigationProp } from "@react-navigation/stack"
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useEffect, useState } from "react"
import TaskItem from "@/components/TaskItem"
import { pedirPermisos } from "@/services/notificationsService"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, typography, radius } from "@/themes/theme"
import { globalStyles } from "@/themes/styles"
import { useTaskStore } from "@/store/taskStore"
import { useAuthStore } from "@/store/authStore"
import { Plus, LogOut, Trash2, ClipboardList, CheckCheck, CircleUserRound } from "lucide-react-native"

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {

    const { tasks, loadTasks, toggleComplete, deleteTask, clearCompleted } = useTaskStore()
    const { logout, usuario } = useAuthStore()
    const [showUserMenu, setShowUserMenu] = useState(false)

    useEffect(() => {
        loadTasks()
        pedirPermisos()
    }, [])

    const pendientes = tasks.filter(t => !t.completada)
    const completadas = tasks.filter(t => t.completada)

    const handleLogout = async () => {
        setShowUserMenu(false)
        await logout()
        navigation.replace("Login")
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View style={styles.logoRow}>
                        <Text style={styles.appTitle}>Procrastin</Text>
                        <View style={styles.arBadge}>
                            <Text style={styles.arBadgeText}>AR</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.avatarButton}
                        onPress={() => setShowUserMenu(true)}
                    >
                        <CircleUserRound size={26} color={colors.textMuted} strokeWidth={1.25} />
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Pendientes</Text>
                    {pendientes.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{pendientes.length}</Text>
                        </View>
                    )}
                </View>
                <View style={[styles.section, pendientes.length > 0 && styles.sectionFilled]}>
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
                </View>

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
                <View style={[styles.section, completadas.length > 0 && styles.sectionFilled]}>
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
            </View>

            <Modal
                visible={showUserMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setShowUserMenu(false)}
            >
                <TouchableOpacity
                    style={styles.menuOverlay}
                    activeOpacity={1}
                    onPress={() => setShowUserMenu(false)}
                >
                    <View style={styles.userMenu}>
                        {usuario && (
                            <Text style={styles.menuEmail} numberOfLines={1}>
                                {usuario.usuario}
                            </Text>
                        )}
                        <View style={styles.menuDivider} />
                        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                            <LogOut size={15} color={colors.danger} />
                            <Text style={styles.menuItemText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4,
    },
    appTitle: {
        fontSize: 22, fontWeight: '300', color: colors.text,
    },
    arBadge: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginBottom: 3,
    },
    arBadgeText: {
        fontSize: 14, fontWeight: '800', color: '#fff',
    },
    avatarButton: {
        padding: spacing.xs,
        marginBottom: 4,
    },
    section: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    sectionFilled: {
        borderWidth: 0,
        padding: 0,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
        marginTop: spacing.sm,
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
    emptyText: {
        fontSize: typography.caption,
        color: colors.textMuted,
    },
    bottomButtons: {
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    menuOverlay: {
        flex: 1,
    },
    userMenu: {
        position: 'absolute',
        top: 90,
        right: spacing.lg,
        backgroundColor: colors.background,
        borderRadius: radius.md + 2,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: spacing.sm,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    menuEmail: {
        fontSize: typography.caption,
        color: colors.textMuted,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    menuDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.xs,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    menuItemText: {
        fontSize: typography.body,
        fontWeight: '500',
        color: colors.danger,
    },
})

export default HomeScreen
