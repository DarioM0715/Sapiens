import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const publicUser = (doc) => ({
  id: doc._id,
  username: doc.username,
  email: doc.email,
  name: doc.name,
  avatar: doc.avatar,
  sex: doc.sex,
  background: doc.background,
  note: doc.note,
  theme: doc.theme,
  role: doc.role,
});

const setAuthCookie = (res, user) => {
  const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" });
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

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

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

    const user = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    setAuthCookie(res, user);
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = (_req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  return res.json({ message: "Sesión cerrada" });
};

export const verify = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Error en verify:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};