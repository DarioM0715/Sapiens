import { Router } from "express";
import {
  listPosts,
  listFollowingPosts,
  listSavedPosts,
  listLikedPosts,
  getPost,
  createPost,
  likePost,
  dislikePost,
  toggleSavePost,
  listComments,
  createComment,
  requireAuth,
} from "../controllers/contentController.js";

const router = Router();

router.get("/", listPosts);
router.get("/following", requireAuth, listFollowingPosts);
router.get("/saved", requireAuth, listSavedPosts);
router.get("/liked", listLikedPosts);
router.post("/", requireAuth, createPost);
router.get("/:id", getPost);
router.post("/:id/like", requireAuth, likePost);
router.post("/:id/dislike", requireAuth, dislikePost);
router.post("/:id/save", requireAuth, toggleSavePost);
router.get("/:id/comments", listComments);
router.post("/:id/comments", requireAuth, createComment);

export default router;