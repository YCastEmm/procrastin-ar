import { useState } from "react"
import { Task } from "@/types/Task.type"
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import { CalendarDays, Clock, Check, ChevronDown, MapPin, User, CalendarCheck, Trash2 } from "lucide-react-native"
import { spacing } from "@/themes/theme"

type TaskItemProps = {
    task: Task
    completarTarea?: (value: string) => void
    eliminarTarea?: (value: string) => void
}

const PRIORITY_BORDER: Record<string, string> = {
    alta: "#fd6367",
    media: "#f59e0b",
    baja: "#0dcf5e",
}

const PRIORITY_DOT: Record<string, string> = {
    alta: "#fd6367",
    media: "#f59e0b",
    baja: "#0dcf5e",
}

const TaskItem = ({ task, completarTarea, eliminarTarea }: TaskItemProps) => {
    const [expanded, setExpanded] = useState(false)
    const esCompletada = task.completada
    const borderColor = task.prioridad ? PRIORITY_BORDER[task.prioridad] : "#252c38"
    const dotColor = task.prioridad ? PRIORITY_DOT[task.prioridad] : "#888"

    const hasDetails = !!(task.fotoUri || task.ubicacion || task.contacto || task.calendarEventId)

    return (
        <View style={[styles.container, { borderTopColor: borderColor }]}>
            {/* Main row */}
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.checkWrap}
                    onPress={() => completarTarea?.(task.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <View style={[styles.checkCircle, esCompletada && styles.checkCircleFilled]}>
                        {esCompletada && <Check size={12} color="#111" strokeWidth={3} />}
                    </View>
                </TouchableOpacity>

                <View style={styles.content}>
                    <Text
                        style={[styles.description, esCompletada && styles.descriptionCompleted]}
                        numberOfLines={expanded ? undefined : 2}
                    >
                        {task.descripcion}
                    </Text>
                    <View style={styles.metaRow}>
                        {task.prioridad && (
                            <>
                                <View style={[styles.dot, { backgroundColor: dotColor }]} />
                                <Text style={[styles.prioridadLabel, { color: dotColor }]}>
                                    {task.prioridad.charAt(0).toUpperCase() + task.prioridad.slice(1)}
                                </Text>
                                <Text style={styles.metaSep}>·</Text>
                            </>
                        )}
                        <CalendarDays size={11} color="#888" />
                        <Text style={styles.metaText}>{task.fecha}</Text>
                        {task.hora && (
                            <>
                                <Text style={styles.metaSep}>·</Text>
                                <Clock size={11} color="#888" />
                                <Text style={styles.metaText}>{task.hora}</Text>
                            </>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => setExpanded(v => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <ChevronDown
                        size={18}
                        color="#555"
                        style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
                    />
                </TouchableOpacity>
            </View>

            {/* Expanded detail panel */}
            {expanded && (
                <View style={styles.details}>
                    {hasDetails && <View style={styles.detailsDivider} />}

                    {task.fotoUri && (
                        <Image source={{ uri: task.fotoUri }} style={styles.photo} resizeMode="cover" />
                    )}

                    {task.ubicacion && (
                        <View style={styles.detailRow}>
                            <MapPin size={13} color="#888" />
                            <Text style={styles.detailText}>
                                {task.ubicacion.direccion
                                    ?? `${task.ubicacion.lat.toFixed(5)}, ${task.ubicacion.lng.toFixed(5)}`}
                            </Text>
                        </View>
                    )}

                    {task.contacto && (
                        <View style={styles.detailRow}>
                            <User size={13} color="#888" />
                            <Text style={styles.detailText}>
                                {task.contacto.nombre}
                                {task.contacto.telefono ? `  ·  ${task.contacto.telefono}` : ""}
                            </Text>
                        </View>
                    )}

                    {task.calendarEventId && (
                        <View style={styles.detailRow}>
                            <CalendarCheck size={13} color="#888" />
                            <Text style={styles.detailText}>Agregado al calendario</Text>
                        </View>
                    )}

                    {eliminarTarea && (
                        <TouchableOpacity
                            style={styles.deleteRow}
                            onPress={() => eliminarTarea(task.id)}
                        >
                            <Trash2 size={13} color="#fd6367" />
                            <Text style={styles.deleteText}>Eliminar tarea</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1e2229",
        borderRadius: 12,
        borderTopWidth: 2,
        padding: 14,
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    checkWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    checkCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },
    checkCircleFilled: {
        backgroundColor: "#0dcf5e",
        borderColor: "#0dcf5e",
    },
    content: {
        flex: 1,
    },
    description: {
        fontSize: 15,
        fontWeight: "500",
        color: "#ffffff",
        marginBottom: 4,
    },
    descriptionCompleted: {
        textDecorationLine: "line-through",
        color: "#888",
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    prioridadLabel: {
        fontSize: 12,
        fontWeight: "600",
    },
    metaSep: {
        fontSize: 12,
        color: "#555",
    },
    metaText: {
        fontSize: 12,
        color: "#888",
    },
    details: {
        marginTop: 10,
        gap: 8,
    },
    detailsDivider: {
        height: 1,
        backgroundColor: "#252c38",
        marginBottom: 4,
    },
    photo: {
        width: "100%",
        height: 160,
        borderRadius: 8,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
    detailText: {
        flex: 1,
        fontSize: 13,
        color: "#aaa",
        lineHeight: 18,
    },
    deleteRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 4,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#252c38",
    },
    deleteText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#fd6367",
    },
})

export default TaskItem
