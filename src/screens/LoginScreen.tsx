import { useState } from "react"
import { Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from "../../App"
import { verificarUsuario } from "@/services/authService"
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

    const handleLogin = async () => {
        const successfullLogin = await verificarUsuario(usuario, contraseña)
        if (successfullLogin === null) {
            setError("El usuario no existe")
        }
        if (successfullLogin === true) {
            navigation.navigate("Home")
        }
        if (successfullLogin === false) {
            setError("Credenciales de acceso inválidas")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>

            <Text style={styles.label}>Usuario</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Ingresá tu usuario"
                placeholderTextColor={colors.textMuted}
                value={usuario}
                onChangeText={setUsuario}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.textInput}
                secureTextEntry
                placeholder="Ingresá tu contraseña"
                placeholderTextColor={colors.textMuted}
                value={contraseña}
                onChangeText={setContraseña}
            />

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
    error: {
        fontSize: typography.caption, color: colors.danger,
        marginBottom: spacing.md, textAlign: 'center',
    },
})

export default LoginScreen