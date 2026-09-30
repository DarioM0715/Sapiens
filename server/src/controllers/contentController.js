import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";
import Post from "../models/Post.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, username: true, avatar: true },
    });
    if (!user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "No autorizado" });
  }
};

const serializeUser = (user) => ({
  id: user?.userId ?? 0,
  name: user?.name ?? "",
  username: user?.username ?? "",
  avatar: user?.avatar ?? "",
});

export const serializePost = (doc, replyCount = 0, currentUserId = null) => {
  const likedBy = doc.likedBy ?? [];
  const dislikedBy = doc.dislikedBy ?? [];
  const savedBy = doc.savedBy ?? [];
  const uid = currentUserId ? String(currentUserId) : null;
  return {
    id: doc._id.toString(),
    parentId: doc.parentId ? doc.parentId.toString() : null,
    title: doc.title ?? "",
    description: doc.description ?? "",
    content: doc.content ?? "",
    time: (doc.createdAt ?? new Date()).toISOString(),
    categories: doc.categories ?? [],
    views: doc.views ?? 0,
    messages: replyCount ?? doc.messages ?? 0,
    likes: likedBy.length,
    dislikes: dislikedBy.length,
    hasLiked: uid ? likedBy.includes(uid) : false,
    hasDisliked: uid ? dislikedBy.includes(uid) : false,
    hasSaved: uid ? savedBy.includes(uid) : false,
    media: doc.media ?? [],
    user: serializeUser(doc.user),
    institution: doc.institution ?? "",
    type: doc.type ?? "",
    documentUrl: doc.documentUrl ?? "",
    bibliography: doc.bibliography ?? [],
  };
};

const getRequestUserId = (req) => {
  try {
    const token = req.cookies?.token;
    if (!token) return null;
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.id;
  } catch {
    return null;
  }
};

const parseCategories = (value) => {
  if (Array.isArray(value)) return value.map((c) => String(c).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((c) => c.trim()).filter(Boolean);
  return [];
};

const isValidId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "ID inválido" });
    return false;
  }
  return true;
};

export const listPosts = async (req, res) => {
  try {
    const { userId, replies } = req.query;
    const filter = userId
      ? {
          "user.userId": String(userId),
          ...(replies === "true" ? { parentId: { $ne: null } } : { parentId: null }),
        }
      : { parentId: null };

    const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();
    const countMap = await attachReplyCounts(posts);
    const currentUserId = getRequestUserId(req);

    return res.json({ posts: posts.map((p) => serializePost(p, countMap[p._id.toString()] ?? 0, currentUserId)) });
  } catch (error) {
    console.error("Error al listar posts:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id, res)) return;

    const post = await Post.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).lean();
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    const count = await countReplies(post._id);
    const currentUserId = getRequestUserId(req);
    return res.json({ post: serializePost(post, count, currentUserId) });
  } catch (error) {
    console.error("Error al obtener post:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const listFollowingPosts = async (req, res) => {
  try {
    const currentUserId = String(req.user.id);

    const follows = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });
    const followingIds = follows.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return res.json({ posts: [] });
    }

    const posts = await Post.find({ "user.userId": { $in: followingIds }, parentId: null }).sort({ createdAt: -1 }).lean();

    const countMap = await attachReplyCounts(posts);

    return res.json({ posts: posts.map((p) => serializePost(p, countMap[p._id.toString()] ?? 0, currentUserId)) });
  } catch (error) {
    console.error("Error al listar posts de seguidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const countReplies = async (postId) => Post.countDocuments({ parentId: postId });

const attachReplyCounts = async (posts) => {
  const counts = await Post.aggregate([
    { $match: { parentId: { $in: posts.map((p) => p._id) } } },
    { $group: { _id: "$parentId", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));
};

// Devuelve las publicaciones guardadas por el usuario actual (solo raíces)
export const listSavedPosts = async (req, res) => {
  try {
    const currentUserId = String(req.user.id);

    const posts = await Post.find({ savedBy: currentUserId, parentId: null }).sort({ createdAt: -1 }).lean();
    const countMap = await attachReplyCounts(posts);

    return res.json({ posts: posts.map((p) => serializePost(p, countMap[p._id.toString()] ?? 0, currentUserId)) });
  } catch (error) {
    console.error("Error al listar publicaciones guardadas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Devuelve las publicaciones a las que el usuario indicado (o el actual) les dio "me gusta" (solo raíces)
export const listLikedPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    const likedUserId = String(userId ?? getRequestUserId(req) ?? "");
    if (!likedUserId) return res.json({ posts: [] });

    const posts = await Post.find({ likedBy: likedUserId, parentId: null }).sort({ createdAt: -1 }).lean();
    const countMap = await attachReplyCounts(posts);
    const currentUserId = getRequestUserId(req);

    return res.json({ posts: posts.map((p) => serializePost(p, countMap[p._id.toString()] ?? 0, currentUserId)) });
  } catch (error) {
    console.error("Error al listar publicaciones con me gusta:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Guarda/quita de guardados una publicación (toggle)
export const toggleSavePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id, res)) return;

    const userId = String(req.user.id);
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    let savedBy = post.savedBy ?? [];
    const saved = !savedBy.includes(userId);
    savedBy = saved ? [...savedBy, userId] : savedBy.filter((u) => u !== userId);

    await Post.updateOne({ _id: post._id }, { $set: { savedBy } });

    const updated = await Post.findById(id).lean();
    const count = await countReplies(post._id);
    return res.json({ post: serializePost(updated, count, userId), saved });
  } catch (error) {
    console.error("Error al guardar/quitar publicación:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title = "", description = "", content = "", type = "", institution = "", documentUrl = "", parentId = null } = req.body;

    if (!description && !content) {
      return res.status(400).json({ message: "El contenido de la publicación es obligatorio" });
    }
    if (!parentId && !title) {
      return res.status(400).json({ message: "El título es obligatorio" });
    }
    if (parentId && !mongoose.isValidObjectId(parentId)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    if (parentId) {
      const parentExists = await Post.exists({ _id: parentId });
      if (!parentExists) {
        return res.status(404).json({ message: "Publicación no encontrada" });
      }
    }

    const post = await Post.create({
      parentId: parentId || null,
      title: parentId ? "" : title,
      description: description || content,
      content,
      type,
      institution,
      documentUrl,
      categories: parentId ? [] : parseCategories(req.body.categories),
      user: {
        userId: req.user.id,
        name: req.user.name || req.user.username,
        username: req.user.username,
        avatar: req.user.avatar ?? "",
      },
    });

    return res.status(201).json({ post: serializePost(post) });
  } catch (error) {
    console.error("Error al crear post:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const toggleReaction = async (req, res, type) => {
  try {
    const { id } = req.params;
    if (!isValidId(id, res)) return;

    const userId = String(req.user.id);
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    let likedBy = post.likedBy ?? [];
    let dislikedBy = post.dislikedBy ?? [];

    const alreadyLiked = likedBy.includes(userId);
    const alreadyDisliked = dislikedBy.includes(userId);

    if (type === "like") {
      if (alreadyLiked) {
        likedBy = likedBy.filter((u) => u !== userId);
      } else {
        likedBy = [...likedBy, userId];
        if (alreadyDisliked) dislikedBy = dislikedBy.filter((u) => u !== userId);
      }
    } else {
      if (alreadyDisliked) {
        dislikedBy = dislikedBy.filter((u) => u !== userId);
      } else {
        dislikedBy = [...dislikedBy, userId];
        if (alreadyLiked) likedBy = likedBy.filter((u) => u !== userId);
      }
    }

    await Post.updateOne({ _id: post._id }, { $set: { likedBy, dislikedBy } });

    const updated = await Post.findById(id).lean();
    const count = await countReplies(post._id);
    return res.json({ post: serializePost(updated, count, userId) });
  } catch (error) {
    console.error("Error al actualizar reacción en el post:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const likePost = (req, res) => toggleReaction(req, res, "like");
export const dislikePost = (req, res) => toggleReaction(req, res, "dislike");

// Devuelve las respuestas (hijas) de una publicación. Una respuesta es una publicación con parentId
export const listReplies = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id, res)) return;

    const currentUserId = getRequestUserId(req);
    const replies = await Post.find({ parentId: id }).sort({ createdAt: 1 }).lean();

    return res.json({ posts: replies.map((r) => serializePost(r, 0, currentUserId)) });
  } catch (error) {
    console.error("Error al listar respuestas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Crea una respuesta (publicación hija) dentro del hilo de otra publicación
export const createReply = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id, res)) return;

    const { content } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ message: "La respuesta no puede estar vacía" });
    }

    const postExists = await Post.exists({ _id: id });
    if (!postExists) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    const reply = await Post.create({
      parentId: id,
      title: "",
      description: String(content).trim(),
      content: String(content).trim(),
      user: {
        userId: req.user.id,
        name: req.user.name || req.user.username,
        username: req.user.username,
        avatar: req.user.avatar ?? "",
      },
    });

    return res.status(201).json({ post: serializePost(reply, 0, String(req.user.id)) });
  } catch (error) {
    console.error("Error al crear respuesta:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};