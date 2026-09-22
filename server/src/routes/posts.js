import { Router } from "express";
import {
  listPosts,
  listFollowingPosts,
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
router.get("/following", requireAuth, listFollowingPosts);
router.post("/", requireAuth, createPost);
router.get("/:id", getPost);
router.post("/:id/like", requireAuth, likePost);
router.post("/:id/dislike", requireAuth, dislikePost);
router.get("/:id/comments", listComments);
router.post("/:id/comments", requireAuth, createComment);

export default router;