import { StackNavigationProp } from "@react-navigation/stack"
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useState } from "react"
import { programarRecordatorio } from "@/services/notificationsService"
import { requestCameraPermission, requestMediaLibraryPermission, requestLocationPermission, requestContactsPermission } from "@/services/permissionsService"
import { launchCameraAsync, launchImageLibraryAsync } from "expo-image-picker"
import * as Location from "expo-location"
import * as Contacts from "expo-contacts"
import { Task } from "@/types/Task.type"
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
    const [ubicacion, setUbicacion] = useState<Task['ubicacion']>(undefined)
    const [cargandoUbicacion, setCargandoUbicacion] = useState(false)
    const [contacto, setContacto] = useState<Task['contacto']>(undefined)

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

    const handleUsarUbicacion = async () => {
        const status = await requestLocationPermission()
        if (status !== 'granted') return
        setCargandoUbicacion(true)
        try {
            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            })
            const { latitude: lat, longitude: lng } = coords
            let direccion: string | undefined
            try {
                const [lugar] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng })
                if (lugar) {
                    direccion = [lugar.street, lugar.city, lugar.region]
                        .filter(Boolean)
                        .join(', ')
                }
            } catch {
                // reverseGeocode failed, guardamos solo coords
            }
            setUbicacion({ lat, lng, direccion })
        } finally {
            setCargandoUbicacion(false)
        }
    }

    const handleAsociarResponsable = async () => {
        const status = await requestContactsPermission()
        if (status !== 'granted') return
        const contact = await Contacts.presentContactPickerAsync()
        if (!contact) return
        const telefono = contact.phoneNumbers?.[0]?.number ?? undefined
        setContacto({ nombre: contact.name, telefono })
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
                ubicacion,
                contacto,
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

            <Text style={styles.label}>Ubicación</Text>
            {ubicacion ? (
                <View style={styles.locationRow}>
                    <Text style={styles.locationText} numberOfLines={1}>
                        {ubicacion.direccion ?? `${ubicacion.lat.toFixed(5)}, ${ubicacion.lng.toFixed(5)}`}
                    </Text>
                    <TouchableOpacity onPress={() => setUbicacion(undefined)}>
                        <Text style={styles.locationClear}>Quitar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={[styles.photoButton, styles.locationButton]}
                    onPress={handleUsarUbicacion}
                    disabled={cargandoUbicacion}
                >
                    {cargandoUbicacion
                        ? <ActivityIndicator size="small" color={colors.primary} />
                        : <Text style={styles.photoButtonText}>Usar ubicación actual</Text>
                    }
                </TouchableOpacity>
            )}

            <Text style={styles.label}>Responsable</Text>
            {contacto ? (
                <View style={styles.locationRow}>
                    <Text style={styles.locationText} numberOfLines={1}>
                        {contacto.nombre}{contacto.telefono ? ` · ${contacto.telefono}` : ''}
                    </Text>
                    <TouchableOpacity onPress={() => setContacto(undefined)}>
                        <Text style={styles.locationClear}>Quitar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={[styles.photoButton, styles.locationButton]}
                    onPress={handleAsociarResponsable}
                >
                    <Text style={styles.photoButtonText}>Asociar responsable</Text>
                </TouchableOpacity>
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
    locationButton: {
        flex: 0,
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.lg,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    locationText: {
        flex: 1,
        fontSize: typography.caption,
        color: colors.text,
    },
    locationClear: {
        fontSize: typography.caption,
        color: colors.danger,
        fontWeight: '500',
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
