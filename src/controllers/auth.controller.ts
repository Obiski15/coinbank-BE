import config from "@/config"
import { CookieOptions, NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"

import User from "@/models/user.model"

import {
  IForgotPasswordSchema,
  ILoginSchema,
  IRegisterSchema,
  IResetPasswordSchema,
  IUpdatePasswordSchema,
} from "@/schema/user.schema"

import AppError from "@/utils/AppError"
import catchAsync from "@/utils/catchAsync"
import createHashToken from "@/utils/createHash"

const signTokenAndSend = (
  res: Response,
  user: { userId: Types.ObjectId; email: string },
  statusCode: number
) => {
  const jwtToken = jwt.sign({ userId: user.userId }, config.jwtSecret, {
    expiresIn: `${config.jwtSecretExpires}d`,
  })

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    expires: new Date(
      Date.now() + config.jwtSecretExpires * 24 * 60 * 60 * 1000
    ),
  }

  res.cookie("jwt", jwtToken, cookieOptions)

  res.status(statusCode).json({
    status: "success",
    data: { user: { ...user } },
  })
}

export const register = catchAsync(
  async (
    req: Request<unknown, unknown, IRegisterSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    // create user
    const user = await User.create({
      ...req.body,
    })

    // sign token and send response
    signTokenAndSend(res, { userId: user._id, email: user.email }, 201)
  }
)

export const login = catchAsync(
  async (
    req: Request<unknown, unknown, ILoginSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    // check if user exist
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    )

    // throw error if user not found
    if (!user) return next(new AppError("User not found", 404))

    // confirm user password
    const isPasswordverified = await user.comparePassword(req.body.password)

    if (!isPasswordverified)
      return next(new AppError("Invalid Email or password", 400))

    // sign token and send response
    signTokenAndSend(res, { userId: user._id, email: user.email }, 200)
  }
)

export const forgotPassword = catchAsync(
  async (
    req: Request<unknown, unknown, IForgotPasswordSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) return next(new AppError("User not found", 400))

    // generate reset token
    const resetToken = user.createResetToken()
    await user.save({ validateBeforeSave: false })

    // send email to user

    // send response
    res.status(200).json({
      status: "success",
      // don't send data
      data: {
        resetToken,
        resetRoute: `${req.headers.origin}/reset-password/${resetToken}`,
      },
    })
  }
)

export const resetPassword = catchAsync(
  async (
    req: Request<unknown, unknown, IResetPasswordSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    const user = await User.findOne({
      reset_token: createHashToken(req.body.resetToken),
    })

    if (!user) return next(new AppError("Invalid reset token", 400))

    const isTokenValid = Date.now() < user.reset_token_expires_at!.getTime()

    if (!isTokenValid)
      return next(new AppError("Invalid or Expired reset token", 400))

    user.password = req.body.password
    user.confirm_password = req.body.confirm_password
    user.reset_token = undefined
    user.reset_token_expires_at = undefined
    await user.save({ validateBeforeSave: true })

    res.status(200).json({
      status: "success",
    })
  }
)

export const updatePassword = catchAsync(
  async (
    req: Request<unknown, unknown, IUpdatePasswordSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    const user = await User.findById(res.locals.user._id).select("+password")

    if (!user) return next(new AppError("User not found", 404))

    // confirm user's current password
    const isPasswordverified = await user.comparePassword(
      req.body.current_password
    )

    if (!isPasswordverified)
      return next(new AppError("Invalid current password", 400))

    user.password = req.body.password
    user.confirm_password = req.body.confirm_password
    await user.save({ validateBeforeSave: true })

    res.status(200).json({
      status: "success",
    })
  }
)
