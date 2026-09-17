import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

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

export const serializePost = (doc, commentCount = 0) => ({
  id: doc._id.toString(),
  title: doc.title,
  description: doc.description ?? "",
  content: doc.content ?? "",
  time: (doc.createdAt ?? new Date()).toISOString(),
  categories: doc.categories ?? [],
  views: doc.views ?? 0,
  messages: commentCount || doc.messages || 0,
  likes: doc.likes ?? 0,
  dislikes: doc.dislikes ?? 0,
  media: doc.media ?? [],
  user: serializeUser(doc.user),
  institution: doc.institution ?? "",
  type: doc.type ?? "",
  documentUrl: doc.documentUrl ?? "",
  bibliography: doc.bibliography ?? [],
});

const serializeComment = (doc) => ({
  id: doc._id.toString(),
  postId: doc.postId.toString(),
  content: doc.content,
  likes: doc.likes ?? 0,
  time: (doc.createdAt ?? new Date()).toISOString(),
  user: serializeUser(doc.user),
});

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
    const { userId } = req.query;
    const filter = userId ? { "user.userId": String(userId) } : {};

    const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();

    const counts = await Comment.aggregate([
      { $match: { postId: { $in: posts.map((p) => p._id) } } },
      { $group: { _id: "$postId", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

    return res.json({ posts: posts.map((p) => serializePost(p, countMap[p._id.toString()] ?? 0)) });
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

    const count = await Comment.countDocuments({ postId: post._id });
    return res.json({ post: serializePost(post, count) });
  } catch (error) {
    console.error("Error al obtener post:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, description = "", content = "", type = "", institution = "", documentUrl = "" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "El título es obligatorio" });
    }
    if (!description && !content) {
      return res.status(400).json({ message: "El contenido de la publicación es obligatorio" });
    }

    const post = await Post.create({
      title,
      description: description || content,
      content,
      type,
      institution,
      documentUrl,
      categories: parseCategories(req.body.categories),
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

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id, res)) return;

    const post = await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }).lean();
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    return res.json({ post: serializePost(post) });
  } catch (error) {
    console.error("Error al dar like al post:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id, res)) return;

    const post = await Post.findByIdAndUpdate(id, { $inc: { dislikes: 1 } }, { new: true }).lean();
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    return res.json({ post: serializePost(post) });
  } catch (error) {
    console.error("Error al dar dislike al post:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const listComments = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id, res)) return;

    const comments = await Comment.find({ postId: id }).sort({ createdAt: 1 }).lean();
    return res.json({ comments: comments.map(serializeComment) });
  } catch (error) {
    console.error("Error al listar comentarios:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id, res)) return;

    const { content } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ message: "El comentario no puede estar vacío" });
    }

    const postExists = await Post.exists({ _id: id });
    if (!postExists) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    const comment = await Comment.create({
      postId: id,
      content: String(content).trim(),
      user: {
        userId: req.user.id,
        name: req.user.name || req.user.username,
        username: req.user.username,
        avatar: req.user.avatar ?? "",
      },
    });

    await Post.findByIdAndUpdate(id, { $inc: { messages: 1 } });

    return res.status(201).json({ comment: serializeComment(comment) });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id, res)) return;

    const comment = await Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }).lean();
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    return res.json({ comment: serializeComment(comment) });
  } catch (error) {
    console.error("Error al dar like al comentario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};