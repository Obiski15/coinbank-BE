import { deleteUser, getUser, updateUser } from "@/controllers/user.controller"
import express from "express"

import multerUpload from "@/middlewares/multerUpload"
import parseNestedFields from "@/middlewares/parseNestedFields"
import protect from "@/middlewares/protect"
import validateResource from "@/middlewares/validateResource"

import { updateUserSchema } from "@/schema/user.schema"

const router = express.Router()

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
