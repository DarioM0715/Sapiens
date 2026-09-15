import { Router } from "express";
import {
  signup,
  login,
  logout,
  verify,
  getUsers,
  updateUser,
  verifyEmail,
  resendCode,
  setPassword,
  acceptTerms,
} from "../controllers/authController.js";

const router = Router();

router.get("/users", getUsers);
router.put("/users/me", updateUser);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verify);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode);
router.post("/set-password", setPassword);
router.post("/accept-terms", acceptTerms);

export default router;