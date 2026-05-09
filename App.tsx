import AddTaskScreen from './src/screens/AddTaskScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications'


export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    AddTask: undefined;
};

const Stack = createStackNavigator<RootStackParamList>(); // crea el objeto que maneja la pila de pantallas


// navigatorContainer crea el contenedor que envuelve la app y permite la navegacion
// stack.Navigator define la config del stack
// stack.screen define el nombre de cada pantalla y el componente que le corresponde a cada una

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        houldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
})

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


