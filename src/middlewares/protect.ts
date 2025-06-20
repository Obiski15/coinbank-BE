import User from "@/models/user.model"

import AppError from "@/utils/AppError"
import { verifyAuthTokens } from "@/utils/auth"
import catchAsync from "@/utils/catchAsync"

const protect = catchAsync(async (req, res, next) => {
  const userId: string = verifyAuthTokens(req, res)

  const user = await User.findById(userId).lean()

  if (!user) return next(new AppError("User not found", 404))

  // attach user to res locals
  res.locals.user = user

  next()
})

export default protect
