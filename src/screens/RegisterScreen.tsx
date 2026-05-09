import { StackNavigationProp } from "@react-navigation/stack"
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native"
import { RootStackParamList } from "../../App"
import { useState } from "react"
import { guardarUsuario } from "@/services/authService"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, typography, radius } from "@/themes/theme"
import { globalStyles } from "@/themes/styles"

type RegisterScreenProps = {
    navigation: StackNavigationProp<RootStackParamList>
}

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
    const [usuario, setUsuario] = useState<string>("")
    const [contraseña, setContraseña] = useState<string>("")

    const handleRegister = async () => {
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
            <TextInput
                style={styles.textInput}
                secureTextEntry
                placeholder="Ingresá tu contraseña"
                placeholderTextColor={colors.textMuted}
                value={contraseña}
                onChangeText={setContraseña}
            />

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
})

export default RegisterScreen


