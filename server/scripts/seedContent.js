import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import Post from "../src/models/Post.js";
import Comment from "../src/models/Comment.js";

const prisma = new PrismaClient();

const EXAMPLE_USERS = [
  { username: "ana_rodriguez", name: "Ana Rodríguez", sex: "femenino" },
  { username: "carlos_gomez", name: "Carlos Gómez", sex: "masculino" },
  { username: "maria_fernandez", name: "María Fernández", sex: "femenino" },
  { username: "jose_torres", name: "José Torres", sex: "masculino" },
  { username: "luis_ramirez", name: "Luis Ramírez", sex: "masculino" },
];

const DEFAULT_PASSWORD = "123456";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB conectado");
};

const ensureExampleUsers = async () => {
  const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const ex of EXAMPLE_USERS) {
    await prisma.user.upsert({
      where: { username: ex.username },
      update: {
        name: ex.name,
        sex: ex.sex,
        password: hashed,
        emailVerified: true,
        termsAccepted: true,
      },
      create: {
        username: ex.username,
        email: `${ex.username}@sapiens.test`,
        name: ex.name,
        sex: ex.sex,
        password: hashed,
        emailVerified: true,
        termsAccepted: true,
      },
    });
  }

  return prisma.user.findMany({
    where: { emailVerified: true },
    select: { id: true, name: true, username: true, avatar: true },
    orderBy: { createdAt: "asc" },
  });
};

const seed = async () => {
  await connectDB();
  const seedUsers = await ensureExampleUsers();
  if (seedUsers.length === 0) {
    console.error("No hay usuarios verificados para asignar los posts");
    process.exit(1);
  }

  console.log(`Usuarios de prueba disponibles: ${seedUsers.map((u) => u.username).join(", ")}`);

  const at = (i) => {
    const u = seedUsers[i % seedUsers.length];
    return { userId: u.id, name: u.name || u.username, username: u.username, avatar: u.avatar ?? "" };
  };

  await Post.deleteMany({});
  await Comment.deleteMany({});
  console.log("Contenido anterior eliminado");

  const postsData = [
    {
      title: "Nuevas perspectivas en edición genómica CRISPR",
      description:
        "Resumen de los avances recientes en edición genómica con CRISPR-Cas9, sus aplicaciones terapéuticas y los desafíos éticos pendientes.",
      content:
        "La edición genómica mediante CRISPR-Cas9 ha transformado la biotecnología molecular. Este artículo repasa los avances en corrección de mutaciones asociadas a enfermedades hereditarias, la edición de células somáticas y las estrategias para reducir efectos fuera de objetivo. Se discuten también los marcos regulatorios que comienzan a aparecer en distintos países y las implicaciones éticas de la edición germinal.",
      categories: ["Genómica", "Biotecnología"],
      type: "Artículo",
      institution: "Facultad de Ciencias Biológicas",
      likes: 0,
      dislikes: 0,
    },
    {
      title: "Revisión de sistemas de administración de fármacos con nanopartículas",
      description:
        "Estrategias basadas en nanopartículas para la administración dirigida de fármacos, con énfasis en su traducción clínica.",
      content:
        "Los sistemas de liberación mediada por nanopartículas han progresado rápidamente en la última década. Esta revisión sintetiza avances en entrega dirigida, liberación controlada, biocompatibilidad y desafíos para la traducción clínica, con estudios de caso de ensayos clínicos recientes.",
      categories: ["Nanomedicina", "Revisión", "Bioingeniería"],
      type: "Documento",
      institution: "Instituto de Bioingeniería",
      documentUrl: "https://doi.org/10.1234/sapiens.2025.001",
      likes: 0,
      dislikes: 0,
    },
    {
      title: "Aprendizaje automático aplicado al diagnóstico temprano",
      description:
        "Cómo los modelos de aprendizaje automático mejoran la detección temprana de enfermedades usando datos clínicos e imágenes.",
      content:
        "Los modelos de aprendizaje automático están revolucionando el diagnóstico médico. Este trabajo analiza redes convolucionales para imágenes diagnósticas, modelos de riesgo basados en historiales clínicos y los retos de generalización entre poblaciones. Se proponen métricas de evaluación centradas en la utilidad clínica.",
      categories: ["Inteligencia artificial", "Medicina"],
      type: "Artículo",
      institution: "Departamento de Ciencias de la Computación",
      likes: 0,
      dislikes: 0,
    },
    {
      title: "Transición energética y sostenibilidad en América Latina",
      description:
        "Análisis de las políticas energéticas de la región frente al cambio climático y el rol de las energías renovables.",
      content:
        "La transición energética en América Latina enfrenta retos de infraestructura, financiamiento y equidad. Este ensayo revisa el estado de la matriz energética regional, los compromisos climáticos y las oportunidades de inversión en solar y eólica, proponiendo una agenda de política pública integradora.",
      categories: ["Energía", "Sostenibilidad"],
      type: "Ensayo",
      institution: "Centro de Estudios Ambientales",
      likes: 0,
      dislikes: 0,
    },
    {
      title: "Métodos numéricos para la simulación de flujos turbulentos",
      description:
        "Comparativa de métodos numéricos (LES, DNS y RANS) aplicados a la simulación de flujos turbulentos en ingeniería.",
      content:
        "La simulación de flujos turbulentos es esencial en aerodinámica y procesos industriales. Este artículo compara simulaciones de grandes remolinos (LES), simulación numérica directa (DNS) y modelos RANS en tres casos de referencia, evaluando precisión y costo computacional para decidir el método adecuado según la aplicación.",
      categories: ["Matemáticas", "Ingeniería"],
      type: "Documento",
      institution: "Escuela de Ingeniería Mecánica",
      documentUrl: "https://doi.org/10.1234/sapiens.2025.002",
      likes: 0,
      dislikes: 0,
    },
  ];

  const created = [];
  for (const [i, data] of postsData.entries()) {
    const post = await Post.create({ ...data, user: at(i) });
    created.push(post);
    console.log(`Post "${data.title}" -> ${at(i).username}`);
  }

  const commentsData = [
    { post: created[0], content: "Excelente resumen, ¿qué opinas de la edición germinal en humanos?", likes: 4 },
    { post: created[0], content: "Gracias por mencionar los efectos fuera de objetivo, se subestiman mucho.", likes: 2 },
    { post: created[1], content: "Muy buena revisión clínica, el apartado de biocompatibilidad es clave.", likes: 3 },
    { post: created[1], content: "¿Hay ensayos en fase III con nanocarriers lipídicos?", likes: 1 },
    { post: created[2], content: "Me gustaría ver una comparación con métodos tradicionales de diagnóstico.", likes: 2 },
    { post: created[3], content: "Falta considerar el rol del hidrógeno verde en la región.", likes: 5 },
    { post: created[4], content: "¿Cuál recomiendas para flujos con separación de capa límite?", likes: 1 },
  ];

  for (const [i, c] of commentsData.entries()) {
    await Comment.create({ postId: c.post._id, content: c.content, likes: c.likes, user: at(i + 2) });
  }
  console.log(`${commentsData.length} comentarios creados`);

  for (const post of created) {
    const count = await Comment.countDocuments({ postId: post._id });
    await Post.findByIdAndUpdate(post._id, { messages: count });
  }
};

seed()
  .then(() => {
    console.log("Seed de contenido completado");
  })
  .finally(() => {
    prisma.$disconnect();
    mongoose.disconnect();
  });