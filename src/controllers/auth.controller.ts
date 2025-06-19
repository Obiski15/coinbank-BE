import config from "@/config"
import { NextFunction, Request, Response } from "express"
import passport from "passport"
import speakeasy from "speakeasy"

import User from "@/models/user.model"

import {
  IForgotPasswordSchema,
  ILoginSchema,
  IRegisterSchema,
  IResetPasswordSchema,
  IUpdatePasswordSchema,
  IVerifyEmailToken,
} from "@/schema/user.schema"

import AppError from "@/utils/AppError"
import catchAsync from "@/utils/catchAsync"
import setCookie from "@/utils/setCookie"

import "@/services/google.strategy.service"
import "@/services/facebook.stragegy.service"

import sendMail from "@/services/email.service"

import { createHashToken, signTokenAndSend } from "@/utils/auth"
import sendResponse from "@/utils/sendResponse"

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

    signTokenAndSend(res, user, 201)
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

    signTokenAndSend(res, user, 200)
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
    await sendMail({
      from: config.defaultEmailAddress,
      to: req.body.email,
      html: "",
      subject: "",
    })

    sendResponse({
      res,
      message: "success",
      statusCode: 200,
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
      password_reset_token: createHashToken(req.body.resetToken),
    })

    if (!user) return next(new AppError("Invalid reset token", 400))

    const isTokenValid =
      Date.now() < user.password_reset_token_expires_at!.getTime()

    if (!isTokenValid)
      return next(new AppError("Invalid or Expired reset token", 400))

    user.password = req.body.password
    user.confirm_password = req.body.confirm_password
    user.password_reset_token = undefined
    user.password_reset_token_expires_at = undefined
    await user.save({ validateBeforeSave: true })

    sendResponse({ res, message: "success", statusCode: 200 })
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

    sendResponse({ res, message: "success", statusCode: 200 })
  }
)

export const generateEmailVerificationToken = catchAsync(
  async (req, res, next) => {
    const user = await User.findById(res.locals.user._id)

    // throw an error is there is already an email address present
    if (user?.email) {
      return next(
        new AppError("User already has an email associated with account", 400)
      )
    }

    // generate verification token
    const secret = speakeasy.generateSecret({ length: 20 })

    const code = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
      step: config.emailVerificationTokenExpires,
    })

    // send verification token
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Your OTP Code</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #2d89ef;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            font-size: 12px;
            color: #777;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello, ${user!.personal?.first_name ?? ""}</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <div class="otp-code">${code}</div>
          <p>Please use this code to complete your verification. The OTP is valid for ${config.emailVerificationTokenExpires / 60} minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <div class="footer">
            &copy; 2025 coinbank. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `
    const mailOptions = {
      from: config.defaultEmailAddress,
      to: "random@gmail.com",
      subject: "Your One-Time Password (OTP) for Email Verification",
      html: emailBody,
    }

    user!.email_verification_token = secret.base32
    await user!.save({ validateBeforeSave: false })
    await sendMail(mailOptions)

    const responseData: { message: string; data?: { otp?: string } } = {
      message: "success",
    }

    if (config.nodeEnv === "development") {
      responseData.data = {}
      responseData.data.otp = code
    }

    sendResponse({
      res,
      message: "success",
      statusCode: 200,
      data: responseData,
    })
  }
)

export const verifyEmailVerificationToken = catchAsync(
  async (
    req: Request<unknown, unknown, IVerifyEmailToken["body"]>,
    res,
    next
  ) => {
    const secret = res.locals.user.email_verification_token

    if (!secret) return next(new AppError("Bad request", 400))

    const isTokenValid = speakeasy.totp.verify({
      encoding: "base32",
      secret,
      token: req.body.otp,
      step: config.emailVerificationTokenExpires,
      window: 0,
    })

    if (!isTokenValid) return next(new AppError("Invalid or Expired OTP", 400))

    const user = await User.findById(res.locals.user._id)

    user!.email_verification_token = undefined
    user!.email = req.body.email
    await user?.save({ validateBeforeSave: false })

    sendResponse({ res, message: "success", statusCode: 200 })
  }
)

// google auth
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
})

export const googleAuthCallback = catchAsync(async (req, res, next) => {
  passport.authenticate(
    "google",
    {
      session: false,
    },
    (err: unknown, user: unknown) => {
      if (err) return next(err)
      if (user) {
        const { jwtToken } = user as { jwtToken: string }
        setCookie(res, "jwt", jwtToken, config.jwtCookieExpires)
        res.redirect(`${config.googleAuthRedirect}`)
      }
    }
  )(req, res, next)
})

// facebook auth
export const facebookAuth = passport.authenticate("facebook")

export const facebookAuthCallback = catchAsync(async (req, res, next) => {
  passport.authenticate(
    "facebook",
    { session: false },
    (err: unknown, user: unknown) => {
      if (err) return next(err)

      if (user) {
        const { jwtToken } = user as { jwtToken: string }
        setCookie(res, "jwt", jwtToken, config.jwtCookieExpires)
        res.redirect(`${config.facebookAuthRedirect}`)
      }
    }
  )(req, res, next)
})
