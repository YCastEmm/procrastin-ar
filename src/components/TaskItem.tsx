import { Task } from "@/types/Task.type"
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import { colors, spacing, typography, radius } from "@/themes/theme"

type TaskItemProps = {
    task: Task
    completarTarea?: (value: string) => void
    eliminarTarea?: (value: string) => void
}

const TaskItem = ({ task, completarTarea, eliminarTarea }: TaskItemProps) => {

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.info}>
                    <Text style={styles.description}>{task.descripcion}</Text>
                    <Text style={styles.date}>{task.fecha}</Text>
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
                            <Text style={styles.completeText}>Completar</Text>
                        </TouchableOpacity>
                    )}

                    {eliminarTarea && (
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => eliminarTarea?.(task.id)}
                        >
                            <Text style={styles.deleteText}>Eliminar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    info: {
        flex: 1,
    },
    thumbnail: {
        width: 48,
        height: 48,
        borderRadius: radius.sm,
    },
    description: {
        fontSize: typography.body,
        fontWeight: '500',
        color: colors.text,
    },
    date: {
        fontSize: typography.caption,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    completeButton: {
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
    deleteText: {
        fontSize: typography.caption,
        color: colors.textMuted,
    },
})

export default TaskItem
