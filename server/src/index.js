import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import followRoutes from "./routes/follows.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5174";

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/follows", followRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "API de Sapiens" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, _req, res, _next) => {
  console.error("Error no controlado:", err);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    message: statusCode < 500 ? err.message : "Error interno del servidor",
  });
});

await connectDB();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});