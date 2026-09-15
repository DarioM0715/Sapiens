import { Router } from "express";
import {
  listPosts,
  getPost,
  createPost,
  likePost,
  dislikePost,
  listComments,
  createComment,
  requireAuth,
} from "../controllers/contentController.js";

const router = Router();

router.get("/", listPosts);
router.post("/", requireAuth, createPost);
router.get("/:id", getPost);
router.post("/:id/like", likePost);
router.post("/:id/dislike", dislikePost);
router.get("/:id/comments", listComments);
router.post("/:id/comments", requireAuth, createComment);

export default router;