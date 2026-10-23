# Sapiens

Red social académica y científica que conecta a estudiantes, docentes e investigadores para compartir conocimiento: artículos, documentos de investigación y comunicados institucionales, organizados por categorías e institución.

> **Proyecto colaborativo en desarrollo.** Participé en el desarrollo del proyecto junto al equipo, abarcando desde el backend hasta la integración del frontend. Se encuentra en construcción continua, por lo que está propenso a cambios, mejoras y errores.

## Funcionalidades

- **Registro y autenticación de extremo a extremo:** formulario multipaso (email → código de verificación por correo → contraseña → términos), sesión con JWT en cookies `httpOnly`, restablecimiento y cambio de contraseña, invitación de usuarios y estado reanudable del registro sin persistir datos intermedios.
- **Publicación de contenido:** creación de artículos y documentos con título, descripción, contenido, categorías, institución, enlaces y adjuntos.
- **Interacción social:** likes/dislikes, guardado, respuestas en hilo, seguir/dejar de seguir y listas de seguidores/seguidos.
- **Feeds personalizados:** inicio, "siguiendo", guardados, "me gusta", pestañas de perfil y muro público.
- **Paginación por cursor con scroll infinito:** contratos de API con `nextCursor`/`hasMore` e implementación con `IntersectionObserver` en el frontend, con índices compuestos en ambas bases de datos para consultas eficientes ante volúmenes grandes.
- **Perfiles editables:** foto, portada, biografía e imagen por defecto cuando el usuario no tiene configurada.
- **Centro de notificaciones, panel de ajustes** (sistema, cuenta, tema claro/oscuro) y **módulos de chat y descubrimiento tipo swipe**.

### Colaboración

Entre otras tareas, en este proyecto trabajé en:

- Reescritura del flujo de registro a arquitectura *stateless* con cookies firmadas y verificación de correo por pasos.
- Paginación por cursor en las APIs de publicaciones, usuarios y respuestas, y su integración con scroll infinito en el frontend.
- Carga de datos institucionales de prueba y mejoras de UX en imágenes por defecto.

## Tecnologías

### Frontend

- **React 19** + **TypeScript 5.8**
- **Vite 7** (plugin SWC) con alias `@` → `src`
- **Tailwind CSS 4** (integrado vía `@tailwindcss/vite`) con theming por variables CSS (`light`/`dark`)
- **React Router 7** con `AuthGuard` para rutas protegidas
- **TanStack React Query 5** (caché, mutaciones e `useInfiniteQuery` para paginación)
- **Axios** (cliente HTTP con credenciales/CORS)
- Iconografía: **react-icons** + **lucide-react**; gráficas: **recharts**
- Linting: **ESLint 9** + **typescript-eslint**

### Backend

- **Node.js** + **Express 5** (`cookie-parser`, CORS con credenciales, `dotenv`)
- Autenticación: **JWT** firmado en cookies `httpOnly` + **bcryptjs**
- Envío de códigos de verificación por correo con **Resend**

### Bases de datos (arquitectura híbrida)

- **PostgreSQL** vía **Prisma ORM** → usuarios, roles y relaciones de seguidores (`Follow`), con índice de cursor `(createdAt, id)`.
- **MongoDB** vía **Mongoose** → publicaciones y respuestas (comentarios unificados con `parentId`), con índices compuestos para paginación *keyset*.

## Estructura

```
.
├── src/                 # Frontend React + TypeScript
│   ├── app/             # Router y proveedores
│   ├── components/      # Vistas y componentes de UI
│   ├── context/         # Estado de autenticación
│   ├── hooks/           # Hooks propios (contenido, seguimiento, paginación)
│   ├── services/        # Capa de acceso a la API
│   └── types/           # Definiciones de tipos
└── server/              # API Express
    ├── prisma/          # Esquema PostgreSQL
    ├── scripts/         # Seeds y utilidades
    └── src/
        ├── config/      # Conexiones a BD
        ├── controllers/ # Lógica de negocio
        ├── models/      # Esquemas Mongoose
        ├── routes/      # auth | posts | follows
        └── utils/       # Utilidades compartidas (paginación)
```

## Ejecución local

Requisitos: Node.js 20+, MongoDB y PostgreSQL en local.

```bash
# Frontend (puerto 5174)
npm install
npm run dev

# Backend (puerto 5000)
cd server
npm install
npx prisma db push      # sincroniza el esquema PostgreSQL
npm run dev
```

Variables de entorno del servidor (`server/.env`):

```
PORT
MONGODB_URI
DATABASE_URL
JWT_SECRET
CLIENT_URL
RESEND_API_KEY
RESEND_FROM
RESEND_DEV_MODE
```

Seeds opcionales:

```bash
npm run seed            # usuarios y contenido de ejemplo
node scripts/seedContent.js
```

## Estado del proyecto

En desarrollo activo. Los módulos de **chat** y **swipe** se encuentran en estado de demostración (datos de ejemplo sin backend), algunas rutas aún no están habilitadas y parte de las dependencias instaladas siguen pendientes de integración. Es normal que haya cambios de comportamiento, pendientes técnicos y errores conocidos en este punto.
