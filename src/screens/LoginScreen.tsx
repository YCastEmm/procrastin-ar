import { useState, useEffect } from "react"
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from "../../App"
import { estaLogueado } from "@/services/authService"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, typography, radius } from "@/themes/theme"
import { globalStyles } from "@/themes/styles"
import { useAuthStore } from "@/store/authStore"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react-native"

type LoginScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const [usuario, setUsuario] = useState<string>("")
    const [contraseña, setContraseña] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [mostrarContraseña, setMostrarContraseña] = useState<boolean>(false)

    const { login } = useAuthStore()

    useEffect(() => {
        (async () => {
            if (await estaLogueado()) {
                navigation.replace("Home")
            }
        })()
    }, [])

    const handleLogin = async () => {
        const result = await login(usuario, contraseña)
        if (result === null) {
            setError("El usuario no existe")
        } else if (result === true) {
            navigation.replace("Home")
        } else {
            setError("Credenciales de acceso inválidas")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoRow}>
                <Text style={styles.appTitle}>Procrastin</Text>
                <View style={styles.arBadge}>
                    <Text style={styles.arBadgeText}>AR</Text>
                </View>
            </View>
            <Text style={styles.appSubtitle}>
                No hagas hoy lo que podés dejar para mañana
            </Text>
            <Text style={styles.iniciarSesion}>Iniciar sesión</Text>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
                <Mail size={16} color={colors.textMuted} />
                <TextInput
                    style={styles.innerInput}
                    placeholder="Ingresá tu email"
                    placeholderTextColor={colors.textMuted}
                    value={usuario}
                    onChangeText={setUsuario}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
                <Lock size={16} color={colors.textMuted} style={styles.lockIcon} />
                <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={!mostrarContraseña}
                    placeholder="Ingresá tu contraseña"
                    placeholderTextColor={colors.textMuted}
                    value={contraseña}
                    onChangeText={setContraseña}
                />
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setMostrarContraseña(!mostrarContraseña)}
                >
                    {mostrarContraseña
                        ? <EyeOff size={18} color={colors.textMuted} />
                        : <Eye size={18} color={colors.textMuted} />
                    }
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={globalStyles.primaryButton} onPress={handleLogin}>
                <View style={styles.buttonContent}>
                    <LogIn size={16} color="#fff" />
                    <Text style={globalStyles.primaryButtonText}>Iniciar sesión</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyles.secondaryButton}
                onPress={() => navigation.navigate("Register")}>
                <Text style={globalStyles.secondaryButtonText}>Registrarme</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center',
        paddingHorizontal: spacing.lg, paddingTop: spacing.md,
        backgroundColor: colors.background,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 4,
        marginBottom: spacing.xs,
    },
    appTitle: {
        fontSize: 36, fontWeight: '300', color: colors.text,
    },
    arBadge: {
        backgroundColor: colors.primary,
        borderRadius: 7,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginBottom: 5,
    },
    arBadgeText: {
        fontSize: 22, fontWeight: '800', color: '#fff',
    },
    appSubtitle: {
        fontSize: 16, fontWeight: "200",
        textAlign: 'center', marginBottom: spacing.xxl,
    },
    iniciarSesion: {
        color: colors.textMuted,
        textAlign: 'left', marginBottom: spacing.lg,
        fontWeight: "600", fontSize: 20,
    },
    label: {
        fontSize: typography.sectionHeader, fontWeight: '600',
        color: colors.textMuted, textTransform: 'uppercase',
        letterSpacing: 0.5, marginBottom: spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: colors.border,
        borderRadius: radius.md, backgroundColor: colors.surface,
        paddingLeft: spacing.md, marginBottom: spacing.lg,
    },
    innerInput: {
        flex: 1, fontSize: typography.body, color: colors.text,
        padding: spacing.md, paddingLeft: spacing.sm,
    },
    passwordContainer: {
        flexDirection: 'row', alignItems: 'center', borderWidth: 1,
        borderColor: colors.border, borderRadius: radius.md,
        backgroundColor: colors.surface, marginBottom: spacing.lg,
        paddingLeft: spacing.md,
    },
    lockIcon: {
        flexShrink: 0,
    },
    passwordInput: {
        flex: 1, fontSize: typography.body, color: colors.text,
        padding: spacing.md, paddingLeft: spacing.sm,
    },
    toggleButton: {
        paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    },
    buttonContent: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    },
    error: {
        fontSize: typography.caption, color: colors.danger,
        marginBottom: spacing.md, textAlign: 'center',
    },
})

export default LoginScreen
