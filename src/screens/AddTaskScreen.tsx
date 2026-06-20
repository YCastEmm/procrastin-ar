import { StackNavigationProp } from "@react-navigation/stack"
import { ActivityIndicator, Image, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useState } from "react"
import { programarRecordatorio } from "@/services/notificationsService"
import { requestCameraPermission, requestMediaLibraryPermission, requestLocationPermission, requestContactsPermission, requestCalendarPermission } from "@/services/permissionsService"
import { launchCameraAsync, launchImageLibraryAsync } from "expo-image-picker"
import * as Location from "expo-location"
import * as Contacts from "expo-contacts"
import * as Calendar from "expo-calendar"
import { Task } from "@/types/Task.type"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography, radius } from "@/themes/theme"
import { useTaskStore } from "@/store/taskStore"
import { CalendarDays, Clock, Camera, Images, MapPin, User, Plus, CalendarCheck } from "lucide-react-native"


type AddTaskScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const AddTaskScreen = ({ navigation }: AddTaskScreenProps) => {

    const [tarea, setTarea] = useState<string>("")
    const [fechaElegida, setFechaElegida] = useState<Date>(new Date())
    const [horaElegida, setHoraElegida] = useState<Date>(new Date())
    const [fotoUri, setFotoUri] = useState<string | undefined>()
    const [ubicacion, setUbicacion] = useState<Task['ubicacion']>(undefined)
    const [cargandoUbicacion, setCargandoUbicacion] = useState(false)
    const [contacto, setContacto] = useState<Task['contacto']>(undefined)
    const [showCalendarModal, setShowCalendarModal] = useState(false)

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

    const abrirDatePicker = () => {
        DateTimePickerAndroid.open({
            value: fechaElegida,
            mode: 'date',
            onChange: (event, selectedDate) => {
                if (selectedDate) setFechaElegida(selectedDate)
            }
        })
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

    const getFechaHora = () => {
        const dt = new Date(fechaElegida)
        dt.setHours(horaElegida.getHours(), horaElegida.getMinutes(), 0, 0)
        return dt
    }

    const getDefaultCalendarId = async (): Promise<string | null> => {
        if (Platform.OS === 'ios') {
            const cal = await Calendar.getDefaultCalendarAsync()
            return cal?.id ?? null
        }
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
        // Preferir calendarios de cuenta (Google, etc.) sobre calendarios locales
        const primary = calendars.find(c => c.isPrimary && c.allowsModifications && !c.source?.isLocalAccount)
            ?? calendars.find(c => c.allowsModifications && !c.source?.isLocalAccount)
            ?? calendars.find(c => c.allowsModifications)
        return primary?.id ?? null
    }

    const handleAddTask = () => {
        setShowCalendarModal(true)
    }

    const confirmarGuardar = async (conCalendario: boolean) => {
        setShowCalendarModal(false)
        try {
            let calendarEventId: string | undefined
            if (conCalendario) {
                const calStatus = await requestCalendarPermission()
                if (calStatus === 'granted') {
                    try {
                        const calendarId = await getDefaultCalendarId()
                        if (calendarId) {
                            const startDate = getFechaHora()
                            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
                            calendarEventId = await Calendar.createEventAsync(calendarId, {
                                title: tarea,
                                startDate,
                                endDate,
                                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            })
                        }
                    } catch (e) { console.error('createEventAsync:', e) }
                }
            }

            const nuevaTarea = {
                id: Date.now().toString(),
                fecha: fechaElegida.toLocaleDateString('es-AR'),
                descripcion: tarea,
                completada: false,
                fotoUri,
                ubicacion,
                contacto,
                calendarEventId,
            }
            await addTask(nuevaTarea)
            await programarRecordatorio(tarea, getFechaHora())
            navigation.navigate("Home")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.appBrand}>
                    Procrastin<Text style={styles.appBrandBold}>AR</Text>
                </Text>
                <Text style={styles.pageTitle}>Nueva tarea</Text>

                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="¿Qué tenés que hacer?"
                    placeholderTextColor={colors.textMuted}
                    value={tarea}
                    onChangeText={setTarea}
                />

                <Text style={styles.label}>Recordatorio</Text>
                <View style={styles.datetimeRow}>
                    <TouchableOpacity style={[styles.timeRow, styles.datetimeField]} onPress={abrirDatePicker}>
                        <View style={styles.timeLabelRow}>
                            <CalendarDays size={13} color={colors.textMuted} />
                            <Text style={styles.timeLabel}>Fecha</Text>
                        </View>
                        <Text style={styles.timeValue}>
                            {fechaElegida.toLocaleDateString('es-AR')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.timeRow, styles.datetimeField]} onPress={abrirPicker}>
                        <View style={styles.timeLabelRow}>
                            <Clock size={13} color={colors.textMuted} />
                            <Text style={styles.timeLabel}>Hora</Text>
                        </View>
                        <Text style={styles.timeValue}>
                            {horaElegida.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Foto</Text>
                <View style={styles.photoRow}>
                    <TouchableOpacity style={styles.photoButton} onPress={handleTomarFoto}>
                        <View style={styles.iconButtonContent}>
                            <Camera size={15} color={colors.primary} />
                            <Text style={styles.photoButtonText}>Tomar foto</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.photoButton} onPress={handleElegirDeGaleria}>
                        <View style={styles.iconButtonContent}>
                            <Images size={15} color={colors.primary} />
                            <Text style={styles.photoButtonText}>De galería</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {fotoUri && (
                    <Image source={{ uri: fotoUri }} style={styles.preview} />
                )}

                <Text style={styles.label}>Ubicación</Text>
                {ubicacion ? (
                    <View style={styles.locationRow}>
                        <MapPin size={14} color={colors.textMuted} />
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
                            : (
                                <View style={styles.iconButtonContent}>
                                    <MapPin size={15} color={colors.primary} />
                                    <Text style={styles.photoButtonText}>Usar ubicación actual</Text>
                                </View>
                            )
                        }
                    </TouchableOpacity>
                )}

                <Text style={styles.label}>Responsable</Text>
                {contacto ? (
                    <View style={styles.locationRow}>
                        <User size={14} color={colors.textMuted} />
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
                        <View style={styles.iconButtonContent}>
                            <User size={15} color={colors.primary} />
                            <Text style={styles.photoButtonText}>Asociar responsable</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.createButton}
                onPress={handleAddTask}
            >
                <View style={styles.createButtonContent}>
                    <Plus size={18} color="#fff" />
                    <Text style={styles.createButtonText}>Crear tarea</Text>
                </View>
            </TouchableOpacity>

            <Modal
                visible={showCalendarModal}
                transparent
                animationType="fade"
                onRequestClose={() => confirmarGuardar(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalTitleRow}>
                            <CalendarCheck size={18} color={colors.primary} />
                            <Text style={styles.modalTitle}>¿Agregar al calendario?</Text>
                        </View>
                        <Text style={styles.modalMessage}>
                            ¿Querés crear un evento en tu calendario para esta tarea?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSecondary]}
                                onPress={() => confirmarGuardar(false)}
                            >
                                <Text style={styles.modalButtonSecondaryText}>No, solo guardar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonPrimary]}
                                onPress={() => confirmarGuardar(true)}
                            >
                                <Text style={styles.modalButtonPrimaryText}>Sí, agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
    scrollContent: {
        paddingBottom: spacing.md,
    },
    appBrand: {
        fontSize: 13, fontWeight: '400', color: colors.textMuted,
        marginBottom: spacing.xs,
        letterSpacing: 0.3,
    },
    appBrandBold: {
        fontWeight: '700', color: colors.primary,
    },
    pageTitle: {
        fontSize: 28, fontWeight: '700', color: colors.text,
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginTop: spacing.sm,
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
    datetimeRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    datetimeField: {
        flex: 1,
        marginBottom: 0,
    },
    timeRow: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    timeLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
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
        justifyContent: 'center',
    },
    iconButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
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
        marginBottom: spacing.md,
    },
    createButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    createButtonText: {
        fontSize: typography.body,
        fontWeight: '600',
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: radius.md,
        padding: spacing.lg,
        width: '100%',
        gap: spacing.sm,
    },
    modalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    modalTitle: {
        fontSize: typography.body,
        fontWeight: '700',
        color: colors.text,
    },
    modalMessage: {
        fontSize: typography.body,
        color: colors.textMuted,
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    modalButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        alignItems: 'center',
    },
    modalButtonSecondary: {
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalButtonPrimary: {
        backgroundColor: colors.primary,
    },
    modalButtonSecondaryText: {
        fontSize: typography.caption,
        fontWeight: '500',
        color: colors.text,
    },
    modalButtonPrimaryText: {
        fontSize: typography.caption,
        fontWeight: '600',
        color: '#fff',
    },
})

export default AddTaskScreen
