import config from "@/config"
import jwt from "jsonwebtoken"

import User from "@/models/user.model"

import AppError from "@/utils/AppError"
import catchAsync from "@/utils/catchAsync"
import jwtToken from "@/utils/jwtToken"

const protect = catchAsync(async (req, res, next) => {
  const token: string = jwtToken(req, next)

  // verify token
  const { userId } = jwt.verify(token, config.jwtSecret) as { userId: string }

  // check for user
  const user = await User.findById(userId).lean()

  if (!user) return next(new AppError("User not found", 404))

  // attach user to res locals
  res.locals.user = user

  next()
})

export default protect
