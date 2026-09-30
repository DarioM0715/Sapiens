import "dotenv/config";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";
import Post from "../src/models/Post.js";

const prisma = new PrismaClient();

const username = process.argv[2];
if (!username) {
  console.error("Uso: node scripts/deleteUserCascade.js <username>");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const user = await prisma.user.findUnique({
  where: { username },
  select: { id: true, username: true, name: true },
});
if (!user) {
  console.error(`El usuario "${username}" no existe`);
  process.exit(1);
}

console.log(`Eliminando en cascada a "${user.username}" (${user.id})...`);

// 1. Todos los posts del usuario (raíces y respuestas en posts de otros)
const userPosts = await Post.find({ "user.userId": user.id }, { _id: 1 }).lean();
const userPostIds = userPosts.map((p) => p._id);

// 2. Responde el usuario a posts de otros: quedan cubiertas por el punto 1 (user.userId)

// 3. Respuestas de terceros a los posts del usuario
const repliesDeleted = userPostIds.length
  ? await Post.deleteMany({ parentId: { $in: userPostIds } })
  : { deletedCount: 0 };

// 4. Los posts/respuestas del usuario
const userPostsDeleted = userPostIds.length
  ? await Post.deleteMany({ _id: { $in: userPostIds } })
  : { deletedCount: 0 };

// 5. El usuario en PostgreSQL
await prisma.user.delete({ where: { id: user.id } });

console.log(`✔ Usuario eliminado de PostgreSQL`);
console.log(`✔ ${userPostsDeleted.deletedCount} publicaciones del usuario eliminadas`);
console.log(`✔ ${repliesDeleted.deletedCount} respuestas a sus publicaciones eliminadas`);

await prisma.$disconnect();
await mongoose.disconnect();