# Procrastin-AR

App de lista de tareas con almacenamiento 100% local.

## Demo

[Video demo](https://youtube.com/shorts/bold3eTuEcM)


## Funcionalidades

### Parcial 1

- Registro e inicio de sesion de usuario (almacenamiento local)
- Creacion de tareas con descripcion y recordatorio programado
- Notificaciones locales al momento programado
- Notificacion diaria de repaso a las 9:00 AM
- Marcado de tareas como completadas
- Eliminacion de tareas individuales
- Limpieza masiva de tareas completadas
- Secciones separadas de pendientes y completadas

### Parcial 2

- **Estado global con Zustand**: la lista de tareas y el usuario autenticado se manejan mediante `taskStore` y `authStore`, reemplazando el `useState`/prop drilling del Parcial 1.
- **Permisos de dispositivo**: manejo centralizado de los estados concedido/denegado/pendiente para camara, galeria, ubicacion, contactos y calendario, con mensaje claro al usuario si un permiso es rechazado.
- **Foto adjunta a la tarea**: se puede tomar una foto con la camara o elegir una imagen de la galeria (`expo-image-picker`), asociarla a la tarea y verla en la lista.
- **Ubicacion del lugar a realizar la tarea**: captura de la ubicacion actual del dispositivo (`expo-location`), con direccion aproximada (reverse geocoding) y coordenadas como respaldo.
- **Contacto responsable**: seleccion de un contacto de la agenda del dispositivo (`expo-contacts`) y asociacion a la tarea.
- **Evento en el calendario**: creacion automatica de un evento en el calendario nativo del dispositivo (`expo-calendar`) al guardar una tarea con fecha, vinculado mediante su id; el evento se elimina si se borra la tarea.
- **Testing automatizado**: suite de tests con Jest y React Native Testing Library cubriendo un componente reutilizable, una funcion de logica de negocio y el store global.

## Tecnologias

- React Native + Expo
- TypeScript
- React Navigation (stack)
- AsyncStorage (persistencia local)
- Zustand (estado global)
- expo-notifications (recordatorios)
- expo-image-picker (camara y galeria)
- expo-location (ubicacion / GPS)
- expo-contacts (seleccion de contactos)
- expo-calendar (eventos de calendario)
- Jest + React Native Testing Library (testing)

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

> Nota: las funcionalidades de camara, ubicacion, contactos y calendario requieren un dispositivo fisico o emulador Android/iOS (Expo Go). No estan soportadas completamente en `npm run web`.

## Correr los tests

```bash
npm test
```

Esto ejecuta la suite de Jest, que incluye:

- Test de componente (`TaskItem`)
- Test de logica de negocio (`taskService`)
- Test del store global (`taskStore`)

## Estructura del proyecto

```
src/
  components/     Componentes reutilizables (TaskItem)
  screens/        Pantallas de la app (Login, Register, Home, AddTask)
  services/       Logica de negocio (auth, tasks, notifications, permissions)
  store/          Estado global con Zustand (taskStore, authStore)
  themes/         Diseno visual (colores, estilos)
  types/          Definiciones de tipos (Task, Usuario)
```

## Uso de IA en el desarrollo

Se utilizó Claude como asistente de IA durante el desarrollo de la app, principalmente para:

- Planificacion de la implementacion de las nuevas funcionalidades nueva, para definir el orden y la estructura de carpetas y archivos.
- Resolucion de dudas conceptuales (ej: diferencias entre Context API y Zustand) y debugging de errores de entorno (SDK de Android, warnings de Expo Go).

#### Ejemplo de prompt
```
Tengo un bug con el servicio de permisos: `requestLocationPermission` no muestra el diálogo nativo de permiso en Android (Expo Go). La función devuelve `"denied"` directamente, sin solicitar el permiso al usuario.

Se invoca desde el botón "Usar ubicación actual" en `AddTaskScreen`. Ya verifiqué que el permiso de ubicación no esté restringido a nivel de configuración del dispositivo/emulador, y reinicié el bundler con caché limpia (`expo start -c`), pero el comportamiento persiste.

La función es:

export async function requestLocationPermission(): Promise<PermissionStatus> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status;
}
```