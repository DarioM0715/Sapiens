import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import Post from "../models/Post.js";
import { decodeUserCursor, paginate, parseLimit, prismaCursorWhere } from "../utils/pagination.js";

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
  emailVerified: true,
  termsAccepted: true,
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
  emailVerified: user.emailVerified,
  termsAccepted: user.termsAccepted,
  role: user.role ?? { id: 0, name: "alumno" },
});

const setAuthCookie = (res, user) => {
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, COOKIE_OPTIONS);
};

const codeMatches = (submitted = "", expected = "") => {
  const a = Buffer.from(String(submitted));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length || a.length === 0) return false;
  return crypto.timingSafeEqual(a, b);
};


const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

const deliverCode = async (email, code) => {
  const devMode = process.env.RESEND_DEV_MODE === "true";

  try {
    await sendVerificationEmail(email, code);
    console.log(`[EMAIL] Código enviado a ${email}`);
  } catch (error) {
    console.error(`[EMAIL] No se pudo enviar el código a ${email}:`, error?.message ?? error);
  }

  if (devMode) {
    console.log(`[DEV] Código de verificación para ${email}: ${code}`);
  }

  return { devCode: devMode ? code : null };
};

const sendVerificationEmail = async (email, code) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Sapiens <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("[EMAIL] Falta RESEND_API_KEY en server/.env. No se pudo enviar el correo.");
  }

  let Resend;
  try {
    ({ Resend } = await import("resend"));
  } catch (error) {
    console.error("[EMAIL] Paquete 'resend' no instalado. Ejecuta: cd server && pnpm add resend", error);
    console.log(`[DEV] Código de verificación para ${email}: ${code}`);
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Sapiens - Tu código de verificación",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="margin: 0 0 16px; color: #111827;">Verifica tu email en Sapiens</h2>
        <p style="margin: 0 0 16px; color: #374151; font-size: 15px;">Hola, hemos recibido una solicitud de verificación para tu cuenta. Usa el siguiente código para completar el registro:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; background: #eff6ff; border-radius: 8px; padding: 12px 20px;">${code}</span>
        </div>
        <p style="margin: 0; color: #6b7280; font-size: 13px;">El código expira al completar el registro. Si no solicitaste esta verificación, ignora este correo.</p>
      </div>`,
  });

  if (error) {
    console.error("[EMAIL] Error al enviar con Resend:", error);
    throw error;
  }
};

export const signup = async (req, res) => {
  try {
    const { username, email, name = "", sex = "masculino" } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "username y email son requeridos" });
    }

    const normalizedUsername = String(username).toLowerCase();
    const normalizedEmail = String(email).toLowerCase();

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username: normalizedUsername }, { email: normalizedEmail }] },
      select: { username: true, email: true },
    });
    if (existing) {
      const message =
        existing.username === normalizedUsername
          ? "El nombre de usuario ya está en uso"
          : "El email ya está registrado";
      return res.status(409).json({ message });
    }

    const code = generateCode();
    const delivery = await deliverCode(normalizedEmail, code);

    setSignupCookie(res, {
      email: normalizedEmail,
      username: normalizedUsername,
      name,
      sex,
      code,
      emailVerified: false,
    });

    return res.status(201).json({
      message: delivery.devCode
        ? "Datos guardados (modo dev). Usa el código devCode para verificar tu cuenta."
        : "Datos guardados. Revisa tu email para verificar tu cuenta.",
      needsEmailVerification: true,
      email: normalizedEmail,
      devCode: delivery.devCode,
    });
  } catch (error) {
    console.error("Error en signup:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const draft = requireSignupDraft(req, res);
    if (!draft) return;

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "code es requerido" });
    }
    if (draft.emailVerified) {
      return res.status(400).json({ message: "El email ya fue verificado" });
    }
    if (!codeMatches(code, draft.code)) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    setSignupCookie(res, {
      email: draft.email,
      username: draft.username,
      name: draft.name,
      sex: draft.sex,
      emailVerified: true,
    });

    return res.json({
      message: "Email verificado correctamente",
      email: draft.email,
      nextStep: 2,
    });
  } catch (error) {
    console.error("Error en verifyEmail:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const resendCode = async (req, res) => {
  try {
    const draft = requireSignupDraft(req, res);
    if (!draft) return;

    const { email } = req.body;
    if (email && String(email).toLowerCase() !== draft.email) {
      return res.status(404).json({ message: "No hay un registro pendiente para este email" });
    }
    if (draft.emailVerified) {
      return res.status(400).json({ message: "El email ya fue verificado" });
    }

    const code = generateCode();
    const delivery = await deliverCode(draft.email, code);

    setSignupCookie(res, {
      email: draft.email,
      username: draft.username,
      name: draft.name,
      sex: draft.sex,
      code,
      emailVerified: false,
    });

    return res.json({
      message: delivery.devCode ? "Código reenviado (modo dev)." : "Código reenviado. Revisa tu email.",
      devCode: delivery.devCode,
    });
  } catch (error) {
    console.error("Error en resendCode:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const setPassword = async (req, res) => {
  try {
    const draft = requireSignupDraft(req, res, { verified: true });
    if (!draft) return;

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "password es requerida" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    setSignupCookie(res, {
      email: draft.email,
      username: draft.username,
      name: draft.name,
      sex: draft.sex,
      emailVerified: true,
      passwordHash,
    });

    return res.json({ message: "Contraseña configurada correctamente", nextStep: 3 });
  } catch (error) {
    console.error("Error en setPassword:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const acceptTerms = async (req, res) => {
  try {
    const draft = requireSignupDraft(req, res, { verified: true });
    if (!draft) return;

    const { accepted } = req.body;

    if (accepted !== true) {
      return res.status(400).json({ message: "Debes aceptar los términos y condiciones" });
    }
    if (!draft.passwordHash) {
      return res.status(400).json({ message: "Debes configurar tu contraseña antes de continuar" });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username: draft.username }, { email: draft.email }] },
      select: { username: true, email: true },
    });
    if (existing) {
      res.clearCookie(SIGNUP_COOKIE);
      const message =
        existing.username === draft.username
          ? "El nombre de usuario ya está en uso"
          : "El email ya está registrado";
      return res.status(409).json({ message });
    }

    const created = await prisma.user.create({
      data: {
        username: draft.username,
        email: draft.email,
        password: draft.passwordHash,
        name: draft.name ?? "",
        sex: draft.sex ?? "masculino",
        emailVerified: true,
        verificationCode: null,
        termsAccepted: true,
        roleId: 1,
      },
      select: selectUser,
    });

    res.clearCookie(SIGNUP_COOKIE);

    const safe = publicUser(created);
    setAuthCookie(res, safe);
    return res.status(201).json({ message: "¡Cuenta creada con éxito!", user: safe });
  } catch (error) {
    console.error("Error en acceptTerms:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email y password son requeridos" });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() } ,
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Debes verificar tu email antes de iniciar sesión",
        needsVerification: true,
        email: user.email,
      });
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

export const getUsers = async (req, res) => {
  try {
    const limit = parseLimit(req.query.limit);
    const cursor = req.query.cursor ? decodeUserCursor(req.query.cursor) : null;
    if (req.query.cursor && !cursor) {
      return res.status(400).json({ message: "Cursor inválido" });
    }

    const rows = await prisma.user.findMany({
      where: prismaCursorWhere(cursor),
      select: selectUser,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
    });

    const { items, nextCursor, hasMore } = paginate(rows, limit);

    let followingIds = new Set();
    const token = req.cookies?.token;
    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        const follows = await prisma.follow.findMany({
          where: { followerId: payload.id },
          select: { followingId: true },
        });
        followingIds = new Set(follows.map((follow) => follow.followingId));
      } catch {
        followingIds = new Set();
      }
    }

    return res.json({
      users: items.map((user) => ({ ...user, isFollowing: followingIds.has(user.id) })),
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getUsersId = async (req, res) => {
  const searchId = req.params.id;

  if (!searchId || !searchId.trim()) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: searchId },
      select: selectUser,
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({ where: { followingId: user.id } }),
      prisma.follow.count({ where: { followerId: user.id } }),
    ]);

    let isFollowing = false;
    const token = req.cookies?.token;
    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (payload.id !== user.id) {
          const exists = await prisma.follow.findUnique({
            where: { followerId_followingId: { followerId: payload.id, followingId: user.id } },
            select: { id: true },
          });
          isFollowing = !!exists;
        }
      } catch {
        isFollowing = false;
      }
    }

    return res.json({ user: { ...publicUser(user), followersCount, followingCount, isFollowing } });
  } catch (error) {
    console.error("Error al buscar usuario:", error);
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

    const safe = publicUser(user);

    try {
      // Sincroniza el autor embebido en posts y respuestas (MongoDB) con los datos editados
      const author = {
        "user.name": safe.name,
        "user.username": safe.username,
        "user.avatar": safe.avatar ?? "",
      };
      await Post.updateMany({ "user.userId": payload.id }, { $set: author });
    } catch (mongoError) {
      console.error("No se pudieron sincronizar posts tras actualizar el perfil:", mongoError);
    }

    return res.json({ user: safe });
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