import { useState } from "react"
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../App"
import { verificarUsuario } from "@/services/authService";
import { SafeAreaView } from "react-native-safe-area-context";

type LoginScreenProps = {
    navigation: StackNavigationProp<RootStackParamList> // recibe navigation como prop que viene del stack.navigator
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {

    const [usuario, setUsuario] = useState<string>("")
    const [contraseña, setContraseña] = useState<string>("")
    const [error, setError] = useState<string>("")


    // acciona segun al respuesta de verificarUsuario
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
            <Text>Login</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Usuario"
                value={usuario}
                onChangeText={setUsuario}
            />
            <TextInput
                style={styles.textInput}
                secureTextEntry
                placeholder="Contraseña"
                value={contraseña}
                onChangeText={setContraseña}
            />
            <TouchableOpacity
                style={styles.touchable}
                onPress={handleLogin}>
                <Text>Iniciar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.touchable}
                onPress={() => navigation.navigate("Register")}
            >
                <Text>Registrarme</Text>
            </TouchableOpacity>
            <Text>{error}</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#e4e4e4',
    },

    textInput: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 8,
        marginBottom: 8
    },

    touchable: {
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 8,
        marginBottom: 8,
    }
})

export default LoginScreen