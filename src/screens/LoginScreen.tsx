import { useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"


const LoginScreen = () => {

    const [usuario, setUsuario] = useState<string>()
    const [contraseña, setContraseña] = useState<string>()


    return (
        <View>
            <Text>Login</Text>
            <TextInput 
                placeholder="Usuario"
                value={usuario}
                onChangeText={setUsuario}
                />
            <TextInput 
                secureTextEntry 
                placeholder="Contraseña"
                value={contraseña}
                onChangeText={setContraseña}
                />
            <TouchableOpacity>
                <Text>Iniciar sesión</Text>
            </TouchableOpacity>
        </View>
    )
} 

export default LoginScreen