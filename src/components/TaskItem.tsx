import { Task } from "@/types/Task.type"
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import { colors, spacing, typography, radius } from "@/themes/theme"
import { CalendarDays, MapPin, User, Check, Trash2 } from "lucide-react-native"

type TaskItemProps = {
    task: Task
    completarTarea?: (value: string) => void
    eliminarTarea?: (value: string) => void
}

const TaskItem = ({ task, completarTarea, eliminarTarea }: TaskItemProps) => {
    const esCompletada = task.completada

    return (
        <View style={[styles.container, esCompletada && styles.containerCompleted]}>
            <View style={styles.row}>
                <View style={styles.info}>
                    <Text style={[styles.description, esCompletada && styles.descriptionCompleted]}>
                        {task.descripcion}
                    </Text>

                    <View style={styles.metaRow}>
                        <CalendarDays size={12} color={colors.textMuted} />
                        <Text style={styles.metaText}>{task.fecha}</Text>
                    </View>

                    {task.ubicacion && (
                        <View style={styles.metaRow}>
                            <MapPin size={12} color={colors.textMuted} />
                            <Text style={styles.metaText} numberOfLines={1}>
                                {task.ubicacion.direccion
                                    ?? `${task.ubicacion.lat.toFixed(5)}, ${task.ubicacion.lng.toFixed(5)}`}
                            </Text>
                        </View>
                    )}

                    {task.contacto && (
                        <View style={styles.metaRow}>
                            <User size={12} color={colors.textMuted} />
                            <Text style={styles.metaText} numberOfLines={1}>
                                {task.contacto.nombre}
                            </Text>
                        </View>
                    )}
                </View>
                {task.fotoUri && (
                    <Image source={{ uri: task.fotoUri }} style={styles.thumbnail} />
                )}
            </View>

            {(completarTarea || eliminarTarea) && (
                <View style={styles.actions}>
                    {completarTarea && (
                        <TouchableOpacity
                            style={styles.completeButton}
                            onPress={() => completarTarea?.(task.id)}
                        >
                            <Check size={13} color={colors.success} />
                            <Text style={styles.completeText}>Completar</Text>
                        </TouchableOpacity>
                    )}
                    {eliminarTarea && (
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => eliminarTarea?.(task.id)}
                        >
                            <Trash2 size={14} color={colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: radius.md + 2,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    containerCompleted: {
        opacity: 0.55,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
    },
    info: {
        flex: 1,
    },
    thumbnail: {
        width: 52,
        height: 52,
        borderRadius: radius.md,
    },
    description: {
        fontSize: typography.body,
        fontWeight: '500',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    descriptionCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textMuted,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 3,
    },
    metaText: {
        flex: 1,
        fontSize: typography.caption,
        color: colors.textMuted,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.success,
    },
    completeText: {
        fontSize: typography.caption,
        color: colors.success,
        fontWeight: '500',
    },
    deleteButton: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
})

export default TaskItem
