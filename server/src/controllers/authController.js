import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const selectUser = {
  id: true,
  username: true,
  email: true,
  name: true,
  avatar: true,
  sex: true,
  background: true,
  note: true,
  theme: true,
  createdAt: true,
  updatedAt: true,
  role: { select: { id: true, name: true } },
};

export const publicUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  name: user.name,
  avatar: user.avatar,
  sex: user.sex,
  background: user.background,
  note: user.note,
  theme: user.theme,
  role: user.role ?? { id: 0, name: "alumno" },
});

const setAuthCookie = (res, user) => {
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, COOKIE_OPTIONS);
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email y password son requeridos" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] },
      select: { username: true, email: true },
    });
    if (existing) {
      const message =
        existing.username === username.toLowerCase()
          ? "El nombre de usuario ya está en uso"
          : "El email ya está registrado";
      return res.status(409).json({ message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        roleId: 1,
      },
      select: selectUser,
    });

    setAuthCookie(res, user);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    console.error("Error en signup:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username y password son requeridos" });
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }] },
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const safe = publicUser(user);
    setAuthCookie(res, safe);
    return res.json({ user: safe });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = (_req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  return res.json({ message: "Sesión cerrada" });
};

export const getUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: selectUser,
      orderBy: { createdAt: "desc" },
    });
    return res.json({ users });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    const allowed = ["name", "username", "sex", "note", "avatar", "background"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (updates.username !== undefined) {
      updates.username = updates.username.toLowerCase();
      const exists = await prisma.user.findFirst({
        where: { username: updates.username, id: { not: payload.id } },
        select: { id: true },
      });
      if (exists) {
        return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
      }
    }

    const user = await prisma.user.update({
      where: { id: payload.id },
      data: updates,
      select: selectUser,
    });

    return res.json({ user: publicUser(user) });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "No autorizado" });
    }
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const verify = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: selectUser });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Error en verify:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};