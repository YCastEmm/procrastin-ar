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
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { useTaskStore } from "@/store/taskStore"
import { spacing } from "@/themes/theme"
import { CalendarDays, Clock, Camera, Images, MapPin, User, Plus, CalendarCheck, X, ChevronLeft } from "lucide-react-native"

type AddTaskScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const PRIORIDAD_COLORS: Record<string, { border: string; bg: string; text: string }> = {
    alta:  { border: "#fd6367", bg: "#2a1416", text: "#fd6367" },
    media: { border: "#f59e0b", bg: "#26200e", text: "#f59e0b" },
    baja:  { border: "#0dcf5e", bg: "#0d261a", text: "#0dcf5e" },
}

const AddTaskScreen = ({ navigation }: AddTaskScreenProps) => {
    const [tarea, setTarea] = useState("")
    const [fechaElegida, setFechaElegida] = useState(new Date())
    const [horaElegida, setHoraElegida] = useState(new Date())
    const [fotoUri, setFotoUri] = useState<string | undefined>()
    const [ubicacion, setUbicacion] = useState<Task["ubicacion"]>(undefined)
    const [cargandoUbicacion, setCargandoUbicacion] = useState(false)
    const [contacto, setContacto] = useState<Task["contacto"]>(undefined)
    const [prioridad, setPrioridad] = useState<Task["prioridad"]>("media")
    const [showCalendarModal, setShowCalendarModal] = useState(false)

    const { addTask } = useTaskStore()

    const handleTomarFoto = async () => {
        const status = await requestCameraPermission()
        if (status !== "granted") return
        const result = await launchCameraAsync({ quality: 0.7 })
        if (!result.canceled) setFotoUri(result.assets[0].uri)
    }

    const handleElegirDeGaleria = async () => {
        const status = await requestMediaLibraryPermission()
        if (status !== "granted") return
        const result = await launchImageLibraryAsync({ quality: 0.7 })
        if (!result.canceled) setFotoUri(result.assets[0].uri)
    }

    const handleUsarUbicacion = async () => {
        const status = await requestLocationPermission()
        if (status !== "granted") return
        setCargandoUbicacion(true)
        try {
            const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
            const { latitude: lat, longitude: lng } = coords
            let direccion: string | undefined
            try {
                const [lugar] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng })
                if (lugar) direccion = [lugar.street, lugar.city, lugar.region].filter(Boolean).join(", ")
            } catch { }
            setUbicacion({ lat, lng, direccion })
        } finally {
            setCargandoUbicacion(false)
        }
    }

    const handleAsociarResponsable = async () => {
        const status = await requestContactsPermission()
        if (status !== "granted") return
        const contact = await Contacts.presentContactPickerAsync()
        if (!contact) return
        setContacto({ nombre: contact.name, telefono: contact.phoneNumbers?.[0]?.number ?? undefined })
    }

    const abrirDatePicker = () => {
        DateTimePickerAndroid.open({
            value: fechaElegida,
            mode: "date",
            onChange: (_, d) => { if (d) setFechaElegida(d) },
        })
    }

    const abrirTimePicker = () => {
        DateTimePickerAndroid.open({
            value: horaElegida,
            mode: "time",
            is24Hour: true,
            onChange: (_, d) => { if (d) setHoraElegida(d) },
        })
    }

    const getFechaHora = () => {
        const dt = new Date(fechaElegida)
        dt.setHours(horaElegida.getHours(), horaElegida.getMinutes(), 0, 0)
        return dt
    }

    const getDefaultCalendarId = async (): Promise<string | null> => {
        if (Platform.OS === "ios") {
            const cal = await Calendar.getDefaultCalendarAsync()
            return cal?.id ?? null
        }
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
        const primary = calendars.find(c => c.isPrimary && c.allowsModifications && !c.source?.isLocalAccount)
            ?? calendars.find(c => c.allowsModifications && !c.source?.isLocalAccount)
            ?? calendars.find(c => c.allowsModifications)
        return primary?.id ?? null
    }

    const confirmarGuardar = async (conCalendario: boolean) => {
        setShowCalendarModal(false)
        try {
            let calendarEventId: string | undefined
            if (conCalendario) {
                const calStatus = await requestCalendarPermission()
                if (calStatus === "granted") {
                    try {
                        const calendarId = await getDefaultCalendarId()
                        if (calendarId) {
                            const startDate = getFechaHora()
                            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
                            calendarEventId = await Calendar.createEventAsync(calendarId, {
                                title: tarea, startDate, endDate,
                                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            })
                        }
                    } catch (e) { console.error("createEventAsync:", e) }
                }
            }
            const notificationId = await programarRecordatorio(tarea, getFechaHora()) ?? undefined
            await addTask({
                id: Date.now().toString(),
                fecha: fechaElegida.toLocaleDateString("es-AR"),
                hora: horaElegida.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
                descripcion: tarea,
                completada: false,
                fotoUri, ubicacion, contacto, calendarEventId, notificationId, prioridad,
            })
            navigation.navigate("Home")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor="#0d0f14" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ChevronLeft size={20} color="#fff" />
                </TouchableOpacity>
                <View style={styles.logoRow}>
                    <Text style={styles.appBrand}>Procrastin</Text>
                    <View style={styles.arBadge}>
                        <Text style={styles.arBadgeText}>AR</Text>
                    </View>
                </View>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.pageTitle}>Nueva tarea</Text>

                {/* Descripción */}
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="¿Qué tenés que hacer?"
                    placeholderTextColor="#555"
                    value={tarea}
                    onChangeText={setTarea}
                    multiline
                />

                {/* Prioridad */}
                <Text style={styles.label}>Prioridad</Text>
                <View style={styles.prioridadRow}>
                    {(["alta", "media", "baja"] as Task["prioridad"][]).map(opcion => {
                        const active = prioridad === opcion
                        const c = PRIORIDAD_COLORS[opcion!]
                        return (
                            <TouchableOpacity
                                key={opcion}
                                style={[
                                    styles.prioridadButton,
                                    active && { borderColor: c.border, backgroundColor: c.bg },
                                ]}
                                onPress={() => setPrioridad(opcion)}
                            >
                                <Text style={[styles.prioridadText, active && { color: c.text, fontWeight: "700" }]}>
                                    {opcion!.charAt(0).toUpperCase() + opcion!.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                {/* Recordatorio */}
                <Text style={styles.label}>Recordatorio</Text>
                <View style={styles.datetimeRow}>
                    <TouchableOpacity style={styles.datetimeCard} onPress={abrirDatePicker}>
                        <View style={styles.datetimeLabelRow}>
                            <CalendarDays size={12} color="#888" />
                            <Text style={styles.datetimeLabel}>Fecha</Text>
                        </View>
                        <Text style={styles.datetimeValue}>{fechaElegida.toLocaleDateString("es-AR")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.datetimeCard} onPress={abrirTimePicker}>
                        <View style={styles.datetimeLabelRow}>
                            <Clock size={12} color="#888" />
                            <Text style={styles.datetimeLabel}>Hora</Text>
                        </View>
                        <Text style={styles.datetimeValue}>
                            {horaElegida.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Foto */}
                <Text style={styles.label}>Foto</Text>
                <View style={styles.twoButtonRow}>
                    <TouchableOpacity style={styles.outlineButton} onPress={handleTomarFoto}>
                        <Camera size={15} color="#0dcf5e" />
                        <Text style={styles.outlineButtonText}>Tomar foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.outlineButton} onPress={handleElegirDeGaleria}>
                        <Images size={15} color="#0dcf5e" />
                        <Text style={styles.outlineButtonText}>De galería</Text>
                    </TouchableOpacity>
                </View>
                {fotoUri && (
                    <View style={styles.previewWrap}>
                        <Image source={{ uri: fotoUri }} style={styles.preview} />
                        <TouchableOpacity style={styles.previewRemove} onPress={() => setFotoUri(undefined)}>
                            <X size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Ubicación */}
                <Text style={styles.label}>Ubicación</Text>
                {ubicacion ? (
                    <View style={styles.chipRow}>
                        <MapPin size={13} color="#888" />
                        <Text style={styles.chipText} numberOfLines={1}>
                            {ubicacion.direccion ?? `${ubicacion.lat.toFixed(5)}, ${ubicacion.lng.toFixed(5)}`}
                        </Text>
                        <TouchableOpacity onPress={() => setUbicacion(undefined)}>
                            <X size={15} color="#fd6367" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.outlineButtonFull} onPress={handleUsarUbicacion} disabled={cargandoUbicacion}>
                        {cargandoUbicacion
                            ? <ActivityIndicator size="small" color="#0dcf5e" />
                            : <>
                                <MapPin size={15} color="#0dcf5e" />
                                <Text style={styles.outlineButtonText}>Usar ubicación actual</Text>
                            </>
                        }
                    </TouchableOpacity>
                )}

                {/* Responsable */}
                <Text style={styles.label}>Responsable</Text>
                {contacto ? (
                    <View style={styles.chipRow}>
                        <User size={13} color="#888" />
                        <Text style={styles.chipText} numberOfLines={1}>
                            {contacto.nombre}{contacto.telefono ? `  ·  ${contacto.telefono}` : ""}
                        </Text>
                        <TouchableOpacity onPress={() => setContacto(undefined)}>
                            <X size={15} color="#fd6367" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.outlineButtonFull} onPress={handleAsociarResponsable}>
                        <User size={15} color="#0dcf5e" />
                        <Text style={styles.outlineButtonText}>Asociar responsable</Text>
                    </TouchableOpacity>
                )}

                <View style={{ height: spacing.lg }} />
            </ScrollView>

            {/* Botón crear */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.createButton, !tarea.trim() && styles.createButtonDisabled]}
                    onPress={() => setShowCalendarModal(true)}
                    disabled={!tarea.trim()}
                >
                    <Plus size={18} color={tarea.trim() ? "#111" : "#0d2e1a"} strokeWidth={2.5} />
                    <Text style={[styles.createButtonText, !tarea.trim() && { color: "#0d2e1a" }]}>Crear tarea</Text>
                </TouchableOpacity>
            </View>

            {/* Modal calendario */}
            <Modal
                visible={showCalendarModal}
                transparent
                animationType="fade"
                onRequestClose={() => confirmarGuardar(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalTitleRow}>
                            <CalendarCheck size={18} color="#0dcf5e" />
                            <Text style={styles.modalTitle}>¿Agregar al calendario?</Text>
                        </View>
                        <Text style={styles.modalMessage}>
                            ¿Querés crear un evento en tu calendario para esta tarea?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalBtnSecondary}
                                onPress={() => confirmarGuardar(false)}
                            >
                                <Text style={styles.modalBtnSecondaryText}>No, solo guardar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalBtnPrimary}
                                onPress={() => confirmarGuardar(true)}
                            >
                                <Text style={styles.modalBtnPrimaryText}>Sí, agregar</Text>
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
        backgroundColor: "#0d0f14",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#1e2229",
        alignItems: "center",
        justifyContent: "center",
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 4,
    },
    appBrand: {
        fontSize: 14,
        fontWeight: "600",
        color: "#888",
        letterSpacing: 0.3,
    },
    arBadge: {
        backgroundColor: "#0dcf5e",
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 1,
        marginBottom: 2,
    },
    arBadgeText: {
        fontSize: 10,
        fontWeight: "900",
        color: "#111",
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    pageTitle: {
        fontSize: 26,
        fontWeight: "700",
        color: "#ffffff",
        letterSpacing: -0.5,
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
    },
    label: {
        fontSize: 11,
        fontWeight: "600",
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: spacing.sm,
        marginTop: spacing.sm,
    },
    textInput: {
        fontSize: 15,
        color: "#ffffff",
        backgroundColor: "#1e2229",
        borderWidth: 1,
        borderColor: "#252c38",
        borderRadius: 10,
        padding: spacing.md,
        marginBottom: spacing.sm,
        minHeight: 52,
    },
    prioridadRow: {
        flexDirection: "row",
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    prioridadButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#252c38",
        backgroundColor: "#1e2229",
        alignItems: "center",
    },
    prioridadText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#888",
    },
    datetimeRow: {
        flexDirection: "row",
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    datetimeCard: {
        flex: 1,
        backgroundColor: "#1e2229",
        borderWidth: 1,
        borderColor: "#252c38",
        borderRadius: 10,
        padding: spacing.md,
        gap: 4,
    },
    datetimeLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    datetimeLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    datetimeValue: {
        fontSize: 15,
        fontWeight: "600",
        color: "#ffffff",
    },
    twoButtonRow: {
        flexDirection: "row",
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    outlineButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#1e2229",
        borderWidth: 1,
        borderColor: "#252c38",
        borderRadius: 10,
        paddingVertical: 11,
    },
    outlineButtonFull: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#1e2229",
        borderWidth: 1,
        borderColor: "#252c38",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    outlineButtonText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#ffffff",
    },
    previewWrap: {
        position: "relative",
        alignSelf: "flex-start",
        marginBottom: spacing.sm,
    },
    preview: {
        width: 90,
        height: 90,
        borderRadius: 10,
    },
    previewRemove: {
        position: "absolute",
        top: -6,
        right: -6,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#fd6367",
        alignItems: "center",
        justifyContent: "center",
    },
    chipRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#1e2229",
        borderWidth: 1,
        borderColor: "#252c38",
        borderRadius: 10,
        paddingHorizontal: spacing.md,
        paddingVertical: 11,
        marginBottom: spacing.sm,
    },
    chipText: {
        flex: 1,
        fontSize: 13,
        color: "#ffffff",
    },
    bottomBar: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
        backgroundColor: "#0d0f14",
    },
    createButton: {
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
    createButtonDisabled: {
        backgroundColor: "#0a7a38",
        shadowOpacity: 0,
        elevation: 0,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
    },
    modalCard: {
        backgroundColor: "#1e2229",
        borderWidth: 1,
        borderColor: "#252c38",
        borderRadius: 14,
        padding: spacing.lg,
        width: "100%",
        gap: spacing.sm,
    },
    modalTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    modalTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#ffffff",
    },
    modalMessage: {
        fontSize: 14,
        color: "#888",
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: "row",
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    modalBtnSecondary: {
        flex: 1,
        paddingVertical: 11,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#252c38",
        alignItems: "center",
    },
    modalBtnPrimary: {
        flex: 1,
        paddingVertical: 11,
        borderRadius: 10,
        backgroundColor: "#0dcf5e",
        alignItems: "center",
    },
    modalBtnSecondaryText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#888",
    },
    modalBtnPrimaryText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#111",
    },
})

export default AddTaskScreen
