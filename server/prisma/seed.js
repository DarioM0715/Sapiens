import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roles = [
  { id: 1, name: "alumno" },
  { id: 2, name: "profesor" },
  { id: 3, name: "moderador" },
];

for (const role of roles) {
  await prisma.role.upsert({
    where: { id: role.id },
    update: {},
    create: role,
  });
}

const hashedPassword = await bcrypt.hash("123456", 10);
await prisma.user.upsert({
  where: { username: "testuser" },
  update: {},
  create: {
    username: "testuser",
    email: "test@test.com",
    password: hashedPassword,
    name: "Test Usuario",
    roleId: 1,
  },
});

console.log("Seed completado: roles + usuario de prueba creados");
await prisma.$disconnect();