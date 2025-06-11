import {
  forgotPassword,
  googleAuth,
  googleAuthCallback,
  login,
  register,
  resetPassword,
  updatePassword,
} from "@/controllers/auth.controller"
import express from "express"

import protect from "@/middlewares/protect"
import validateResource from "@/middlewares/validateResource"

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "@/schema/user.schema"

const router = express.Router()

// google auth route
router.get("/google", googleAuth)
router.get("/google/callback", googleAuthCallback)

router.post("/login", validateResource(loginSchema), login)
router.post("/register", validateResource(registerSchema), register)
router.patch(
  "/auth/password",
  validateResource(updatePasswordSchema),
  protect,
  updatePassword
)
router.post(
  "/forgot-password",
  validateResource(forgotPasswordSchema),
  forgotPassword
)
router.patch(
  "/reset-password",
  validateResource(resetPasswordSchema),
  resetPassword
)

export default router
