import { StackNavigationProp } from "@react-navigation/stack"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"
import { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { guardarUsuario } from "@/services/authService"

type RegisterScreenProps ={
    navigation: StackNavigationProp<RootStackParamList>
}

const RegisterScreen = ({navigation} : RegisterScreenProps) => {

    const [usuario, setUsuario] = useState<string>("")
    const [contraseña, setContraseña] = useState<string>("")


    const handleRegister = async () => {
        await guardarUsuario(usuario, contraseña)
        navigation.navigate("Login")
    }

    return (
        <View style={styles.container}>
            <Text>Registro</Text>
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
                onPress={handleRegister}
            >
                <Text>Crear usuario</Text>
            </TouchableOpacity>
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

export default RegisterScreen


