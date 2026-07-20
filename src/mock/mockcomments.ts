import type { Comment } from "@/types/post";
import image from "@/assets/images/20260328_032700.jpg"

export const exampleComments: Comment[] = [
  {
    id: 1,
    user: { id: 101, name: "María López", username: "maria.l", avatar: image },
    content: "Gran artículo — muy útil la sección de recursos al final.",
    time: "2025-12-27T18:12:00.000Z",
    likes: 24,
    dislikes: 1,
    views: 420,
    messages: 3,
  },
  {
    id: 2,
    user: { id: 102, name: "Javier Ruiz", username: "jruiz" },
    content: "No estoy de acuerdo con el punto 3, creo que falta contexto histórico.",
    time: "2025-12-27T16:45:00.000Z",
    likes: 5,
    dislikes: 7,
    views: 150,
    messages: 8,
  },
  {
    id: 3,
    user: { id: 103, name: "Ana Pérez", username: "anap" },
    content: "Aquí dejo un pequeño video demostrativo:",
    time: "2025-12-26T21:05:00.000Z",
    likes: 47,
    views: 980,
    messages: 12,
  },
  {
    id: 4,
    user: { id: 104, name: "Diego Torres", username: "diegot" },
    content: "Gracias por compartir. ¿Alguien tiene referencias académicas sobre esto?",
    time: "2025-12-25T09:30:00.000Z",
    likes: 3,
    dislikes: 0,
    views: 80,
    messages: 2,
  },
  {
    id: 5,
    user: { id: 105, name: "Lucía Gómez", username: "lucia.g", avatar: image },
    content: "Pequeño hilo con más detalles — lo copio abajo.",

    time: "2025-12-24T14:00:00.000Z",
    likes: 102,
    dislikes: 2,
    views: 2300,
    messages: 25,
  },
  {
    id: 6,
    user: { id: 106, name: "Equipo", username: "equipo_oficial" },
    content: "Actualizamos el post con correcciones — gracias por reportarlo.",
    time: "2025-12-20T11:00:00.000Z",
    likes: 15,
    views: 600,
    messages: 1,
  },
];
