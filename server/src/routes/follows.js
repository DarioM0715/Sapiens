import { Router } from "express";
import { requireAuth } from "../controllers/contentController.js";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../controllers/followController.js";

const router = Router();

router.post("/:id", requireAuth, followUser);
router.delete("/:id", requireAuth, unfollowUser);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);

export default router;
