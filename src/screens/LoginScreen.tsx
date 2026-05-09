import { useState, useEffect } from "react"
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from "../../App"
import { verificarUsuario, iniciarSesion, estaLogueado } from "@/services/authService"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, typography, radius } from "@/themes/theme"
import { globalStyles } from "@/themes/styles"

type LoginScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const [usuario, setUsuario] = useState<string>("")
    const [contraseña, setContraseña] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [mostrarContraseña, setMostrarContraseña] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            if (await estaLogueado()) {
                navigation.replace("Home")
            }
        })()
    }, [])

    const handleLogin = async () => {
        const successfullLogin = await verificarUsuario(usuario, contraseña)
        if (successfullLogin === null) {
            setError("El usuario no existe")
        }
        if (successfullLogin === true) {
            await iniciarSesion(usuario)
            navigation.replace("Home")
        }
        if (successfullLogin === false) {
            setError("Credenciales de acceso inválidas")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.appTitle}>
                Procrastin<Text style={styles.appTitleBold}>AR</Text>
            </Text>
            <Text style={styles.appSubtitle}>
                No hagas hoy lo que podés dejar para mañana
            </Text>
            <Text style={styles.iniciarSesion}>Iniciar sesión</Text>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Ingresá tu usuario"
                placeholderTextColor={colors.textMuted}
                value={usuario}
                onChangeText={setUsuario}
            />

            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={!mostrarContraseña}
                    placeholder="Ingresá tu contraseña"
                    placeholderTextColor={colors.textMuted}
                    value={contraseña}
                    onChangeText={setContraseña}
                />
                <TouchableOpacity style={styles.toggleButton}
                    onPress={() => setMostrarContraseña(!mostrarContraseña)}>
                    <Text style={styles.toggleText}>
                        {mostrarContraseña ? "Ocultar" : "Mostrar"}
                    </Text>
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={globalStyles.primaryButton} onPress={handleLogin}>
                <Text style={globalStyles.primaryButtonText}>Iniciar sesión</Text>
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
    appTitle: {
        fontSize: 36, fontWeight: '300', color: colors.text,
        textAlign: 'center', marginBottom: spacing.xs,
    },
    appTitleBold: {
        fontWeight: '800', color: colors.primary,
    },
    appSubtitle: {
        fontSize: 16, fontWeight: "200",
        textAlign: 'center', marginBottom: spacing.xxl
    }
    ,
    iniciarSesion: {
        color: colors.textMuted,
        textAlign: 'left', marginBottom: spacing.lg,
        fontWeight: "600", fontSize: 20
    },
    label: {
        fontSize: typography.sectionHeader, fontWeight: '600',
        color: colors.textMuted, textTransform: 'uppercase',
        letterSpacing: 0.5, marginBottom: spacing.sm,
    },
    textInput: {
        fontSize: typography.body, color: colors.text, borderWidth: 1,
        borderColor: colors.border, borderRadius: radius.md,
        backgroundColor: colors.surface, padding: spacing.md,
        marginBottom: spacing.lg,
    },
    passwordContainer: {
        flexDirection: 'row', alignItems: 'center', borderWidth: 1,
        borderColor: colors.border, borderRadius: radius.md,
        backgroundColor: colors.surface, marginBottom: spacing.lg,
    },
    passwordInput: {
        flex: 1, fontSize: typography.body, color: colors.text,
        padding: spacing.md,
    },
    toggleButton: {
        paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    },
    toggleText: {
        fontSize: typography.caption, fontWeight: '600', color: colors.primary,
    },
    error: {
        fontSize: typography.caption, color: colors.danger,
        marginBottom: spacing.md, textAlign: 'center',
    },
})

export default LoginScreen