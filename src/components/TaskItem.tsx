import { Task } from "@/types/Task.type"
import { View, Text, TouchableOpacity } from "react-native"

type TaskItemProps = {
    task: Task
    completarTarea?: (value: string) => void
    eliminarTarea?: (value: string) => void
}

const TaskItem = ({ task, completarTarea, eliminarTarea }: TaskItemProps) => {


    return (
        <View>
            <Text>{task.descripcion}</Text>
            <Text>{task.fecha}</Text>
            
            {
                completarTarea &&
                <TouchableOpacity
                    onPress={() => completarTarea?.(task.id)}
                >
                    <Text>Completar</Text>
                </TouchableOpacity>
            }

            {
                eliminarTarea &&
                <TouchableOpacity
                    onPress={() => eliminarTarea?.(task.id)}
                >
                    <Text>Eliminar</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

export default TaskItem