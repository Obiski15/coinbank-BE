import {
  facebookAuth,
  facebookAuthCallback,
  forgotPassword,
  generateEmailVerificationToken,
  googleAuth,
  googleAuthCallback,
  login,
  register,
  resetPassword,
  updatePassword,
  verifyEmailVerificationToken,
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
  verifyEmailTokenSchema,
} from "@/schema/user.schema"

const router = express.Router()

// google auth route
router.get("/google", googleAuth)
router.get("/google/callback", googleAuthCallback)

// facebook auth route
router.get("/facebook", facebookAuth)
router.get("/facebook/callback", facebookAuthCallback)

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

// email verification
router.post("/email/verify", protect, generateEmailVerificationToken)
router.post(
  "/email/token/verify",
  protect,
  validateResource(verifyEmailTokenSchema),
  verifyEmailVerificationToken
)

export default router
