import "dotenv/config";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";
import Post from "../src/models/Post.js";
import Comment from "../src/models/Comment.js";

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

// 1. Posts del usuario
const ownPosts = await Post.find({ "user.userId": user.id }, { _id: 1 }).lean();
const ownPostIds = ownPosts.map((p) => p._id);

// 2. Comentarios del usuario en posts AJENOS (hay que decrementar su contador de mensajes)
const foreignComments = await Comment.find(
  { "user.userId": user.id, postId: { $nin: ownPostIds } },
  { postId: 1 }
).lean();

const grouped = {};
for (const c of foreignComments) {
  const key = c.postId.toString();
  grouped[key] = (grouped[key] || 0) + 1;
}
for (const [postId, n] of Object.entries(grouped)) {
  await Post.findByIdAndUpdate(postId, { $inc: { messages: -n } });
}
if (foreignComments.length) {
  const ids = foreignComments.map((c) => c._id);
  await Comment.deleteMany({ _id: { $in: ids } });
}

// 3. Comentarios en los posts del propio usuario
const ownCommentsDeleted = ownPostIds.length
  ? await Comment.deleteMany({ postId: { $in: ownPostIds } })
  : { deletedCount: 0 };

// 4. Los posts del usuario
const ownPostsDeleted = ownPostIds.length
  ? await Post.deleteMany({ _id: { $in: ownPostIds } })
  : { deletedCount: 0 };

// 5. El usuario en PostgreSQL
await prisma.user.delete({ where: { id: user.id } });

console.log(`✔ Usuario eliminado de PostgreSQL`);
console.log(`✔ ${ownPostsDeleted.deletedCount} posts eliminados`);
console.log(`✔ ${ownCommentsDeleted.deletedCount} comentarios en sus posts eliminados`);
console.log(`✔ ${foreignComments.length} comentarios suyos en posts ajenos eliminados (contadores ajustados en ${Object.keys(grouped).length} posts)`);

await prisma.$disconnect();
await mongoose.disconnect();