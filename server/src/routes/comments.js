import { Router } from "express";
import { likeComment } from "../controllers/contentController.js";

const router = Router();

router.post("/:id/like", likeComment);

export default router;