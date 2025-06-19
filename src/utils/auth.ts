import crypto from "crypto"
import config from "@/config"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"

import { IUserDocument } from "@/models/types"

import AppError from "./AppError"
import sendResponse from "./sendResponse"
import setCookie from "./setCookie"

interface IJwtPayload extends jwt.JwtPayload {
  userId: string
}

export const createHashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex")

export const getAuthTokens = (req: Request) => {
  let token

  if (!req.headers.authorization && !req.cookies.jwt) {
    throw new AppError("Invalid or missing auth token", 401)
  }

  if (req.headers.authorization) {
    if (!req.headers.authorization.startsWith("Bearer"))
      throw new AppError("Invalid auth token", 401)
    token = req.headers.authorization.split(" ")[1]
  } else {
    token = req.cookies.jwt
  }

  return token
}

export const signAuthTokens = (userId: string) => {
  return jwt.sign({ userId: userId }, config.jwtSecret, {
    expiresIn: `${config.jwtSecretExpires}d`,
    algorithm: "HS256",
  })
}

export const verifyAuthTokens = (token: string) => {
  const payload = jwt.verify(token, config.jwtSecret) as IJwtPayload

  return payload
}

export const signTokenAndSend = (
  res: Response,
  user: IUserDocument,
  statusCode: number
) => {
  const jwtToken = signAuthTokens(user._id.toString())

  setCookie(res, "jwt", jwtToken, config.jwtCookieExpires)

  sendResponse({
    res,
    message: "success",
    statusCode: statusCode,
    data: { _id: user._id, email: user.email ?? "" },
  })
}
