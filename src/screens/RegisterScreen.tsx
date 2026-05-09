import { StackNavigationProp } from "@react-navigation/stack"
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native"
import { RootStackParamList } from "../../App"
import { useState, useEffect } from "react"
import { guardarUsuario, estaLogueado } from "@/services/authService"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, typography, radius } from "@/themes/theme"
import { globalStyles } from "@/themes/styles"

type RegisterScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
    const [usuario, setUsuario] = useState<string>("")
    const [contraseña, setContraseña] = useState<string>("")
    const [confirmarContraseña, setConfirmarContraseña] = useState<string>("")
    const [mostrarContraseña, setMostrarContraseña] = useState<boolean>(false)
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        (async () => {
            if (await estaLogueado()) {
                navigation.replace("Home")
            }
        })()
    }, [])

    const handleRegister = async () => {
        if (contraseña !== confirmarContraseña) {
            setError("Las contraseñas no coinciden")
            return
        }
        setError("")
        await guardarUsuario(usuario, contraseña)
        navigation.navigate("Login")
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Crear cuenta</Text>

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

            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={!mostrarConfirmacion}
                    placeholder="Repetí tu contraseña"
                    placeholderTextColor={colors.textMuted}
                    value={confirmarContraseña}
                    onChangeText={setConfirmarContraseña}
                />
                <TouchableOpacity style={styles.toggleButton}
                    onPress={() => setMostrarConfirmacion(!mostrarConfirmacion)}>
                    <Text style={styles.toggleText}>
                        {mostrarConfirmacion ? "Ocultar" : "Mostrar"}
                    </Text>
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={globalStyles.primaryButton} onPress={handleRegister}>
                <Text style={globalStyles.primaryButtonText}>Crear usuario</Text>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyles.secondaryButton}
                onPress={() => navigation.navigate("Login")}>
                <Text style={globalStyles.secondaryButtonText}>Ya tengo cuenta</Text>
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
    title: {
        fontSize: typography.title, fontWeight: '700', color: colors.text,
        marginBottom: spacing.lg, textAlign: 'center',
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

export default RegisterScreen


