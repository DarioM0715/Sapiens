import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const selectCard = {
  id: true,
  name: true,
  username: true,
  avatar: true,
  note: true,
  role: { select: { id: true, name: true } },
};

const publicCard = (user) => ({
  id: user.id,
  name: user.name,
  username: user.username,
  avatar: user.avatar,
  note: user.note,
  role: user.role ?? { id: 0, name: "alumno" },
});

export const followUser = async (req, res) => {
  try {
    const followingId = req.params.id;
    const followerId = req.user.id;

    if (followingId === followerId) {
      return res.status(400).json({ message: "No puedes seguirte a ti mismo" });
    }

    const target = await prisma.user.findUnique({
      where: { id: followingId },
      select: { id: true },
    });
    if (!target) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      update: {},
      create: { followerId, followingId },
    });

    return res.status(201).json({ message: "Usuario seguido", isFollowing: true });
  } catch (error) {
    console.error("Error al seguir usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const followingId = req.params.id;
    const followerId = req.user.id;

    await prisma.follow.deleteMany({ where: { followerId, followingId } });

    return res.json({ message: "Dejaste de seguir al usuario", isFollowing: false });
  } catch (error) {
    console.error("Error al dejar de seguir usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;

    const follows = await prisma.follow.findMany({
      where: { followingId: id },
      orderBy: { createdAt: "desc" },
      select: { follower: { select: selectCard } },
    });

    return res.json({ users: follows.map((follow) => publicCard(follow.follower)) });
  } catch (error) {
    console.error("Error al listar seguidores:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { id } = req.params;

    const follows = await prisma.follow.findMany({
      where: { followerId: id },
      orderBy: { createdAt: "desc" },
      select: { following: { select: selectCard } },
    });

    return res.json({ users: follows.map((follow) => publicCard(follow.following)) });
  } catch (error) {
    console.error("Error al listar seguidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
