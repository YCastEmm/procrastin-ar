import { StackNavigationProp } from "@react-navigation/stack"
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useState } from "react"
import { programarRecordatorio } from "@/services/notificationsService"
import { requestCameraPermission, requestMediaLibraryPermission } from "@/services/permissionsService"
import { launchCameraAsync, launchImageLibraryAsync } from "expo-image-picker"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography, radius } from "@/themes/theme"
import { useTaskStore } from "@/store/taskStore"


type AddTaskScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const AddTaskScreen = ({ navigation }: AddTaskScreenProps) => {

    const [tarea, setTarea] = useState<string>("")
    const [horaElegida, setHoraElegida] = useState<Date>(new Date())
    const [fotoUri, setFotoUri] = useState<string | undefined>()

    const { addTask } = useTaskStore()

    const handleTomarFoto = async () => {
        const status = await requestCameraPermission()
        if (status !== 'granted') return
        const result = await launchCameraAsync({ quality: 0.7 })
        if (!result.canceled) setFotoUri(result.assets[0].uri)
    }

    const handleElegirDeGaleria = async () => {
        const status = await requestMediaLibraryPermission()
        if (status !== 'granted') return
        const result = await launchImageLibraryAsync({ quality: 0.7 })
        if (!result.canceled) setFotoUri(result.assets[0].uri)
    }

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
            const nuevaTarea = {
                id: Date.now().toString(),
                fecha: new Date().toLocaleDateString('es-AR'),
                descripcion: tarea,
                completada: false,
                fotoUri,
            }
            await addTask(nuevaTarea)
            await programarRecordatorio(tarea, horaElegida)
            navigation.navigate("Home")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.appTitle}>
                Procrastin<Text style={styles.appTitleBold}>AR</Text>
            </Text>
            <Text style={styles.subtitle}>Nueva tarea</Text>

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

            <Text style={styles.label}>Foto</Text>
            <View style={styles.photoRow}>
                <TouchableOpacity style={styles.photoButton} onPress={handleTomarFoto}>
                    <Text style={styles.photoButtonText}>Tomar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={handleElegirDeGaleria}>
                    <Text style={styles.photoButtonText}>Elegir de galería</Text>
                </TouchableOpacity>
            </View>
            {fotoUri && (
                <Image source={{ uri: fotoUri }} style={styles.preview} />
            )}

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
    appTitle: {
        fontSize: 36, fontWeight: '300', color: colors.text,
        marginBottom: spacing.xs,
    },
    appTitleBold: {
        fontWeight: '800', color: colors.primary,
    },
    subtitle: {
        fontSize: typography.body, color: colors.textMuted,
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
    photoRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    photoButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    photoButtonText: {
        fontSize: typography.caption,
        fontWeight: '500',
        color: colors.text,
    },
    preview: {
        width: 80,
        height: 80,
        borderRadius: radius.md,
        marginBottom: spacing.md,
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
