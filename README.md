# Procrastin-AR

App de lista de tareas con almacenamiento 100% local.

## Demo

[Video demo](https://www.youtube.com/shorts/FLAN1XovUKw)

## Funcionalidades

- Registro e inicio de sesion de usuario (almacenamiento local)
- Creacion de tareas con descripcion y recordatorio programado
- Notificaciones locales al momento programado
- Notificacion diaria de repaso a las 9:00 AM
- Marcado de tareas como completadas
- Eliminacion de tareas individuales
- Limpieza masiva de tareas completadas
- Secciones separadas de pendientes y completadas

## Tecnologias

- React Native + Expo 
- TypeScript
- React Navigation (stack)
- AsyncStorage (persistencia local)
- expo-notifications (recordatorios)

## Ejecutar en desarrollo

```bash
git clone https://github.com/YCastEmm/procrastin-ar.git
cd procrastin-ar
npm install
npm start
```

Para abrir en una plataforma especifica:

```bash
npm run android
npm run ios
npm run web
```

## Estructura del proyecto

```
src/
  components/     Componentes reutilizables (TaskItem)
  screens/        Pantallas de la app (Login, Register, Home, AddTask)
  services/       Logica de negocio (auth, tasks, notifications)
  themes/         Diseno visual (colores, estilos)
  types/          Definiciones de tipos (Task, User)
```
