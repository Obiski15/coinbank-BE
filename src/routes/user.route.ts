import {
  forgotPassword,
  login,
  register,
  resetPassword,
  updatePassword,
} from "@/controllers/auth.controller"
import { deleteUser, getUser, updateUser } from "@/controllers/user.controller"
import express from "express"

import multerUpload from "@/middlewares/multerUpload"
import parseNestedFields from "@/middlewares/parseNestedFields"
import protect from "@/middlewares/protect"
import validateResource from "@/middlewares/validateResource"

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateUserSchema,
} from "@/schema/user.schema"

const router = express.Router()

router.post("/auth/login", validateResource(loginSchema), login)
router.post("/auth/register", validateResource(registerSchema), register)
router.patch(
  "/auth/password",
  validateResource(updatePasswordSchema),
  protect,
  updatePassword
)
router.post(
  "/auth/forgot-password",
  validateResource(forgotPasswordSchema),
  forgotPassword
)
router.patch(
  "/auth/reset-password",
  validateResource(resetPasswordSchema),
  resetPassword
)

router
  .route("/")
  .get(protect, getUser)
  .patch(
    protect,
    multerUpload.single("image"),
    parseNestedFields,
    validateResource(updateUserSchema),
    updateUser
  )
  .delete(protect, deleteUser)

export default router
