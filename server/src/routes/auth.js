import { Router } from "express";
import { rateLimit } from "../middleware/rateLimit.js";
import {
  signup,
  login,
  logout,
  verify,
  getUsers,
  getUsersId,
  updateUser,
  verifyEmail,
  resendCode,
  setPassword,
  acceptTerms,
} from "../controllers/authController.js";

const router = Router();

const loginLimiter = rateLimit({ key: "login", limit: 5, windowMs: 60 * 1000 });
const verifyEmailLimiter = rateLimit({ key: "verify-email", limit: 8, windowMs: 10 * 60 * 1000 });
const resendCodeLimiter = rateLimit({ key: "resend-code", limit: 3, windowMs: 10 * 60 * 1000 });
const signupLimiter = rateLimit({ key: "signup", limit: 5, windowMs: 10 * 60 * 1000 });

router.get("/users", getUsers);
router.get("/users/:id", getUsersId);
router.put("/users/me", updateUser);
router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.get("/verify", verify);
router.post("/verify-email", verifyEmailLimiter, verifyEmail);
router.post("/resend-code", resendCodeLimiter, resendCode);
router.post("/set-password", setPassword);
router.post("/accept-terms", acceptTerms);

export default router;