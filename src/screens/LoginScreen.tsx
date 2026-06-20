import { useState, useEffect } from "react"
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../../App"
import { estaLogueado } from "@/services/authService"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { useAuthStore } from "@/store/authStore"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react-native"
import { spacing } from "@/themes/theme"

type LoginScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const [usuario, setUsuario] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [error, setError] = useState("")
    const [mostrarContraseña, setMostrarContraseña] = useState(false)

    const { login } = useAuthStore()

    useEffect(() => {
        (async () => {
            if (await estaLogueado()) navigation.replace("Home")
        })()
    }, [])

    const handleLogin = async () => {
        setError("")
        const result = await login(usuario, contraseña)
        if (result === null) setError("El usuario no existe")
        else if (result === true) navigation.replace("Home")
        else setError("Credenciales de acceso inválidas")
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor="#0d0f14" />

            <View style={styles.logoSection}>
                <View style={styles.logoRow}>
                    <Text style={styles.appTitle}>Procrastin</Text>
                    <View style={styles.arBadge}>
                        <Text style={styles.arBadgeText}>AR</Text>
                    </View>
                </View>
                <Text style={styles.appSubtitle}>
                    No hagas hoy lo que podés dejar para mañana
                </Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.formTitle}>Iniciar sesión</Text>

                <Text style={styles.label}>Email</Text>
                <View style={styles.inputRow}>
                    <Mail size={16} color="#888" />
                    <TextInput
                        style={styles.input}
                        placeholder="Ingresá tu email"
                        placeholderTextColor="#555"
                        value={usuario}
                        onChangeText={setUsuario}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.inputRow}>
                    <Lock size={16} color="#888" />
                    <TextInput
                        style={styles.input}
                        placeholder="Ingresá tu contraseña"
                        placeholderTextColor="#555"
                        secureTextEntry={!mostrarContraseña}
                        value={contraseña}
                        onChangeText={setContraseña}
                    />
                    <TouchableOpacity
                        onPress={() => setMostrarContraseña(v => !v)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        {mostrarContraseña
                            ? <EyeOff size={18} color="#888" />
                            : <Eye size={18} color="#888" />
                        }
                    </TouchableOpacity>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                    <LogIn size={16} color="#111" strokeWidth={2.5} />
                    <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.secondaryButtonText}>¿No tenés cuenta? Registrate</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d0f14",
        paddingHorizontal: spacing.lg,
        justifyContent: "center",
    },
    logoSection: {
        alignItems: "center",
        marginBottom: spacing.xl + spacing.lg,
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 6,
        marginBottom: spacing.sm,
    },
    appTitle: {
        fontSize: 36,
        fontWeight: "700",
        color: "#ffffff",
        letterSpacing: -0.5,
    },
    arBadge: {
        backgroundColor: "#0dcf5e",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginBottom: 4,
    },
    arBadgeText: {
        fontSize: 18,
        fontWeight: "900",
        color: "#111",
    },
    appSubtitle: {
        fontSize: 14,
        fontWeight: "300",
        color: "#888",
        textAlign: "center",
    },
    form: {
        gap: 0,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: 11,
        fontWeight: "600",
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: spacing.sm,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        backgroundColor: "#1e2229",
        borderWidth: 1,
        borderColor: "#252c38",
        borderRadius: 10,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#ffffff",
        paddingVertical: 14,
    },
    error: {
        fontSize: 13,
        color: "#fd6367",
        marginBottom: spacing.md,
        textAlign: "center",
    },
    primaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#0dcf5e",
        borderRadius: 12,
        paddingVertical: 16,
        marginTop: spacing.sm,
        marginBottom: spacing.md,
        shadowColor: "#0dcf5e",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },
    secondaryButton: {
        alignItems: "center",
        paddingVertical: spacing.md,
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#888",
    },
})

export default LoginScreen
