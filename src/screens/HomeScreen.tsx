import { useEffect, useRef, useState } from "react"
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { StatusBar } from "expo-status-bar"
import Svg, { Circle } from "react-native-svg"
import { StackNavigationProp } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { Plus, LogOut, CircleUserRound, Clock, CheckCheck, Trash2 } from "lucide-react-native"
import { RootStackParamList } from "../../App"
import TaskItem from "@/components/TaskItem"
import { pedirPermisos } from "@/services/notificationsService"
import { useTaskStore } from "@/store/taskStore"
import { useAuthStore } from "@/store/authStore"
import { spacing } from "@/themes/theme"

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const CircularProgress = ({ percent, size = 64 }: { percent: number; size?: number }) => {
    const stroke = 5
    const r = (size - stroke) / 2
    const circ = 2 * Math.PI * r
    const offset = circ - (percent / 100) * circ

    return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
                <Circle cx={size / 2} cy={size / 2} r={r} stroke="#252c38" strokeWidth={stroke} fill="none" />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke="#0dcf5e"
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={[circ, circ]}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    rotation={-90}
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <Text style={styles.progressRingText}>{percent}%</Text>
        </View>
    )
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const { tasks, loadTasks, toggleComplete, deleteTask, clearCompleted } = useTaskStore()
    const { logout, usuario } = useAuthStore()
    const avatarRef = useRef<View>(null)
    const [menuTop, setMenuTop] = useState(0)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [activeTab, setActiveTab] = useState<"pendientes" | "completadas">("pendientes")

    useEffect(() => {
        loadTasks()
        pedirPermisos()
    }, [])

    const pendientes = tasks.filter(t => !t.completada)
    const completadas = tasks.filter(t => t.completada)
    const total = tasks.length
    const percent = total > 0 ? Math.round((completadas.length / total) * 100) : 0
    const activeTasks = activeTab === "pendientes" ? pendientes : completadas

    const handleLogout = async () => {
        setShowUserMenu(false)
        await logout()
        navigation.replace("Login")
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor="#0d0f14" />

            <FlatList
                style={styles.list}
                contentContainerStyle={styles.listContent}
                data={activeTasks}
                keyExtractor={item => item.id}
                ListHeaderComponent={
                    <View>
                        {/* Header */}
                        <View style={styles.headerRow}>
                            <View>
                                <Text style={styles.welcomeLabel}>BIENVENIDO</Text>
                                <View style={styles.logoRow}>
                                    <Text style={styles.appTitle}>Procrastin</Text>
                                    <View style={styles.arBadge}>
                                        <Text style={styles.arBadgeText}>AR</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                ref={avatarRef}
                                style={styles.avatarButton}
                                onPress={() => {
                                    avatarRef.current?.measureInWindow((_x, y, _w, h) => {
                                        setMenuTop(y + h + 6)
                                    })
                                    setShowUserMenu(true)
                                }}
                            >
                                <CircleUserRound size={22} color="#aaa" strokeWidth={1.5} />
                            </TouchableOpacity>
                        </View>

                        {/* Progress Card */}
                        <View style={styles.progressCard}>
                            <View style={styles.progressTop}>
                                <View>
                                    <Text style={styles.progressLabel}>PROGRESO DIARIO</Text>
                                    <View style={styles.progressCountRow}>
                                        <Text style={styles.progressCount}>{completadas.length}</Text>
                                        <Text style={styles.progressTotal}>/{total}</Text>
                                    </View>
                                </View>
                                <CircularProgress percent={percent} />
                            </View>
                            <View style={styles.progressBarTrack}>
                                <View style={[styles.progressBarFill, { width: `${percent}%` as any }]} />
                            </View>
                        </View>

                        {/* Tab Bar */}
                        <View style={styles.tabBar}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === "pendientes" && styles.tabActive]}
                                onPress={() => setActiveTab("pendientes")}
                            >
                                <Clock size={14} color={activeTab === "pendientes" ? "#fff" : "#888"} />
                                <Text style={[styles.tabText, activeTab === "pendientes" && styles.tabTextActive]}>
                                    Pendientes
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.tabDivider} />
                            <TouchableOpacity
                                style={[styles.tab, activeTab === "completadas" && styles.tabActive]}
                                onPress={() => setActiveTab("completadas")}
                            >
                                <CheckCheck size={14} color={activeTab === "completadas" ? "#fff" : "#888"} />
                                <Text style={[styles.tabText, activeTab === "completadas" && styles.tabTextActive]}>
                                    Completadas
                                </Text>
                                {completadas.length > 0 && (
                                    <View style={styles.tabBadge}>
                                        <Text style={styles.tabBadgeText}>{completadas.length}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            {activeTab === "completadas" && completadas.length > 0 && (
                                <TouchableOpacity style={styles.clearBtn} onPress={clearCompleted}>
                                    <Trash2 size={14} color="#555" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <TaskItem
                        task={item}
                        completarTarea={id => toggleComplete(id)}
                        eliminarTarea={id => deleteTask(id)}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            {activeTab === "pendientes" ? "No tenés tareas pendientes" : "Nada completado aún"}
                        </Text>
                    </View>
                }
                ListFooterComponent={<View style={{ height: 90 }} />}
            />

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("AddTask")}
                >
                    <Plus size={18} color="#111" strokeWidth={2.5} />
                    <Text style={styles.addButtonText}>Agregar tarea</Text>
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
                    <View style={[styles.userMenu, { top: menuTop }]}>
                        {usuario && (
                            <Text style={styles.menuEmail} numberOfLines={1}>
                                {usuario.usuario}
                            </Text>
                        )}
                        <View style={styles.menuDivider} />
                        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                            <LogOut size={15} color="#fd6367" />
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
        backgroundColor: "#0d0f14",
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: spacing.lg,
    },
    welcomeLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#888",
        letterSpacing: 1.5,
        marginBottom: 2,
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 6,
    },
    appTitle: {
        fontSize: 26,
        fontWeight: "700",
        color: "#ffffff",
        letterSpacing: -0.5,
    },
    arBadge: {
        backgroundColor: "#0dcf5e",
        borderRadius: 5,
        paddingHorizontal: 7,
        paddingVertical: 3,
        marginBottom: 3,
    },
    arBadgeText: {
        fontSize: 13,
        fontWeight: "900",
        color: "#111",
    },
    avatarButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#1e2229",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },
    progressCard: {
        backgroundColor: "#1e2229",
        borderRadius: 14,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    progressTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    progressLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#888",
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    progressCountRow: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    progressCount: {
        fontSize: 32,
        fontWeight: "700",
        color: "#ffffff",
        lineHeight: 36,
    },
    progressTotal: {
        fontSize: 18,
        fontWeight: "500",
        color: "#888",
    },
    progressRingText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
    progressBarTrack: {
        height: 6,
        backgroundColor: "#252c38",
        borderRadius: 3,
    },
    progressBarFill: {
        height: 6,
        backgroundColor: "#0dcf5e",
        borderRadius: 3,
    },
    tabBar: {
        flexDirection: "row",
        backgroundColor: "#1e2229",
        borderRadius: 12,
        padding: 4,
        marginBottom: spacing.md,
        alignItems: "center",
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 9,
    },
    tabActive: {
        backgroundColor: "#272e3a",
    },
    tabText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#888",
    },
    tabTextActive: {
        color: "#ffffff",
        fontWeight: "600",
    },
    tabBadge: {
        backgroundColor: "#0dcf5e",
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 1,
        minWidth: 18,
        alignItems: "center",
    },
    tabBadgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#111",
    },
    tabDivider: {
        width: 1,
        height: 20,
        backgroundColor: "#252c38",
    },
    clearBtn: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: spacing.xl,
    },
    emptyText: {
        fontSize: 14,
        color: "#555",
    },
    bottomBar: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
        backgroundColor: "#0d0f14",
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#0dcf5e",
        borderRadius: 12,
        paddingVertical: 16,
        shadowColor: "#0dcf5e",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0d0f14",
    },
    menuOverlay: {
        flex: 1,
    },
    userMenu: {
        position: "absolute",
        right: spacing.lg,
        backgroundColor: "#1e2229",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#252c38",
        paddingVertical: 8,
        minWidth: 200,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    menuEmail: {
        fontSize: 13,
        color: "#888",
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
    },
    menuDivider: {
        height: 1,
        backgroundColor: "#252c38",
        marginVertical: 4,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: 10,
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#fd6367",
    },
})

export default HomeScreen
