import { useState } from "react"
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../App"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Usuario } from "@/types/User.type";

type LoginScreenProps = {
    navigation: StackNavigationProp<RootStackParamList> // recibe navigation como prop que viene del stack.navigator
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {

    const [usuario, setUsuario] = useState<string>("")
    const [contraseña, setContraseña] = useState<string>("")
    const [error, setError] = useState<string>("")


    const verificarUsuario = async () => {
        const storedUser = await AsyncStorage.getItem("usuario")
        if (!storedUser) {
            return null
        }
        const parsedUser: Usuario = JSON.parse(storedUser)

        if (contraseña === parsedUser.contraseña && usuario === parsedUser.usuario) {
            return true
        } else {
            return false
        }
    }

    const handleLogin = async () => {
        const successfullLogin = await verificarUsuario()
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
        <View style={styles.container}>
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
        </View>
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