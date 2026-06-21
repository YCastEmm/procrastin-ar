import { useEffect, useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { spacing } from "@/themes/theme"
import WheelPicker, { WheelItem } from "@/components/WheelPicker"

type PickerModalProps = {
    visible: boolean
    mode: "date" | "time"
    value: Date
    onClose: () => void
    onConfirm: (d: Date) => void
}

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

const pad2 = (n: number) => n.toString().padStart(2, "0")
const diasEnMes = (mes: number, anio: number) => new Date(anio, mes + 1, 0).getDate()
const rango = (desde: number, hasta: number): WheelItem[] => {
    const items: WheelItem[] = []
    for (let v = desde; v <= hasta; v++) items.push({ label: pad2(v), value: v })
    return items
}

const PickerModal = ({ visible, mode, value, onClose, onConfirm }: PickerModalProps) => {
    const [dia, setDia] = useState(value.getDate())
    const [mes, setMes] = useState(value.getMonth())
    const [anio, setAnio] = useState(value.getFullYear())
    const [hora, setHora] = useState(value.getHours())
    const [minuto, setMinuto] = useState(value.getMinutes())

    // Al abrir, sincroniza el estado interno con el valor recibido.
    useEffect(() => {
        if (!visible) return
        setDia(value.getDate())
        setMes(value.getMonth())
        setAnio(value.getFullYear())
        setHora(value.getHours())
        setMinuto(value.getMinutes())
    }, [visible])

    const anioActual = new Date().getFullYear()
    const anios: WheelItem[] = rango(anioActual, anioActual + 5)
    const meses: WheelItem[] = MESES.map((label, value) => ({ label, value }))
    const maxDia = diasEnMes(mes, anio)
    const dias: WheelItem[] = rango(1, maxDia)
    const diaClamped = Math.min(dia, maxDia)

    const horas: WheelItem[] = rango(0, 23)
    const minutos: WheelItem[] = rango(0, 59)

    const confirmar = () => {
        const d = mode === "date"
            ? new Date(anio, mes, diaClamped, value.getHours(), value.getMinutes(), 0, 0)
            : new Date(value.getFullYear(), value.getMonth(), value.getDate(), hora, minuto, 0, 0)
        onConfirm(d)
        onClose()
    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>{mode === "date" ? "Elegí la fecha" : "Elegí la hora"}</Text>

                    <View style={styles.wheelsRow}>
                        {mode === "date" ? (
                            <>
                                <WheelPicker data={dias} selectedValue={diaClamped} onChange={setDia} width={70} />
                                <WheelPicker data={meses} selectedValue={mes} onChange={setMes} width={140} />
                                <WheelPicker data={anios} selectedValue={anio} onChange={setAnio} width={90} />
                            </>
                        ) : (
                            <>
                                <WheelPicker data={horas} selectedValue={hora} onChange={setHora} width={80} />
                                <Text style={styles.colon}>:</Text>
                                <WheelPicker data={minutos} selectedValue={minuto} onChange={setMinuto} width={80} />
                            </>
                        )}
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
                            <Text style={styles.btnSecondaryText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnPrimary} onPress={confirmar}>
                            <Text style={styles.btnPrimaryText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
    },
    card: {
        backgroundColor: "#1e2229",
        borderWidth: 1,
        borderColor: "#252c38",
        borderRadius: 14,
        padding: spacing.lg,
        width: "100%",
        gap: spacing.md,
    },
    title: {
        fontSize: 15,
        fontWeight: "700",
        color: "#ffffff",
        textAlign: "center",
    },
    wheelsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    colon: {
        fontSize: 24,
        fontWeight: "700",
        color: "#ffffff",
        marginHorizontal: 2,
    },
    buttons: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    btnSecondary: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#252c38",
        alignItems: "center",
    },
    btnPrimary: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#0dcf5e",
        alignItems: "center",
    },
    btnSecondaryText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#888",
    },
    btnPrimaryText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111",
    },
})

export default PickerModal
