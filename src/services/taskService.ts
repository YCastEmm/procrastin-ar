import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "@/types/Task.type";

export const getTareas = async () => {
    const stored = await AsyncStorage.getItem("tareas");
    return stored ? JSON.parse(stored) : [];
};

export const saveTareas = async (tareas: Task[]) => {
    await AsyncStorage.setItem("tareas", JSON.stringify(tareas));
};

export const completarTarea = async (id: string) => {
    const tareas = await getTareas();
    const actualizadas = tareas.map((item: Task) => (item.id === id ? { ...item, completada: true } : item));
    await saveTareas(actualizadas);
    return actualizadas;
};

export const eliminarTarea = async (id: string) => {
    const tareas = await getTareas();
    const actualizadas = tareas.filter((item: Task) => item.id !== id);
    await saveTareas(actualizadas);
    return actualizadas;
};
