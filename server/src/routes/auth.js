import { Router } from "express";
import { signup, login, logout, verify, getUsers, updateUser } from "../controllers/authController.js";

const router = Router();

router.get("/users", getUsers);
router.put("/users/me", updateUser);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verify);

export default router;