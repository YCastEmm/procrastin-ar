import { StackNavigationProp } from "@react-navigation/stack"
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native"
import { RootStackParamList } from "../../App"
import { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { programarRecordatorio } from "@/services/notificationsService"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography, radius } from "@/theme"


type AddTaskScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const AddTaskScreen = ({ navigation }: AddTaskScreenProps) => {

    const [tarea, setTarea] = useState<string>("")
    const [horaElegida, setHoraElegida] = useState<Date>(new Date())


    const abrirPicker = () => {
        DateTimePickerAndroid.open({
            value: horaElegida,
            mode: 'time',
            is24Hour: true,
            onChange: (event, selectedDate) => {
                if (selectedDate) setHoraElegida(selectedDate)
            }
        })
    }

    const handleAddTask = async () => {

        try {
        const storedTasks = await AsyncStorage.getItem("tareas")
        const listaTareas = storedTasks ? JSON.parse(storedTasks) : []
        const nuevaTarea = {
            id: Date.now().toString(),
            fecha: new Date().toLocaleDateString('es-AR'),
            descripcion: tarea,
            completada: false,
        }
        listaTareas.push(nuevaTarea)
        await AsyncStorage.setItem("tareas", JSON.stringify(listaTareas))
        await programarRecordatorio(tarea, horaElegida)
        navigation.navigate("Home")
    } catch (error) {
        console.error(error)
    }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Nueva tarea</Text>

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={styles.textInput}
                placeholder="¿Qué tenés que hacer?"
                placeholderTextColor={colors.textMuted}
                value={tarea}
                onChangeText={setTarea}
            />

            <Text style={styles.label}>Recordatorio</Text>
            <TouchableOpacity style={styles.timeRow} onPress={abrirPicker}>
                <Text style={styles.timeLabel}>Hora</Text>
                <Text style={styles.timeValue}>
                    {horaElegida.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.createButton}
                onPress={handleAddTask}
            >
                <Text style={styles.createButtonText}>Crear tarea</Text>
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
    label: {
        fontSize: typography.sectionHeader,
        fontWeight: '600',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
    },
    textInput: {
        fontSize: typography.body,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    timeLabel: {
        fontSize: typography.body,
        color: colors.textMuted,
    },
    timeValue: {
        fontSize: typography.body,
        fontWeight: '600',
        color: colors.text,
    },
    createButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    createButtonText: {
        fontSize: typography.body,
        fontWeight: '600',
        color: '#fff',
    },
})

export default AddTaskScreen
