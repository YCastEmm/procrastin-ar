import { StackNavigationProp } from "@react-navigation/stack"
import { Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../App"

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList> // recibe navigation como prop que viene del stack.navigator
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {

    return (
        <View>
            <Text>Home</Text>

            <TouchableOpacity 
                onPress={() => navigation.navigate("AddTask")}
            >
                <Text>Agregar tarea</Text>
            </TouchableOpacity>
            
        </View>
    )
} 

export default HomeScreen