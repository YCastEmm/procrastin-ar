import AddTaskScreen from './src/screens/AddTaskScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    AddTask: undefined;
};

const Stack = createStackNavigator<RootStackParamList>(); // crea el objeto que maneja la pila de pantallas


// NavigatorContainer crea el contenedor que envuelve la app y permite la navegacion
// Stack.Navigator define la config del stack

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddTask" component={AddTaskScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


