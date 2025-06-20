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

export const getAuthToken = (value: string, req: Request) => {
  let token

  const cookie = req.cookies[value] as string | undefined
  const header = req.headers[value.toLowerCase()] as string | undefined

  if (header) {
    if (!header.startsWith("Bearer"))
      throw new AppError("Invalid auth token", 401)
    token = header.split(" ")[1]
  } else {
    token = cookie
  }

  return token ?? ""
}

export const signToken = ({
  data,
  options,
  secret,
}: {
  data: IJwtPayload
  secret: string
  options: jwt.SignOptions
}) => {
  return jwt.sign(data, secret, {
    expiresIn: options.expiresIn,
    algorithm: options.algorithm,
  })
}

const verifyAccessToken = (req: Request) => {
  const accessToken = getAuthToken("accessToken", req)

  let id: string

  try {
    const { userId } = jwt.verify(accessToken, config.JWT.secret) as IJwtPayload

    id = userId
  } catch (error) {
    id = ""
  }

  return id
}

const verifyRefreshToken = (req: Request, res: Response) => {
  const refreshToken = getAuthToken("refreshToken", req)
  const token = jwt.verify(refreshToken, config.JWT.secret) as IJwtPayload
  const accessToken = signToken({
    data: { userId: token.userId },
    options: {
      algorithm: "HS256",
      expiresIn: config.JWT.accessTokenExpiresIn,
    },
    secret: config.JWT.secret,
  })
  setCookie(res, "accessToken", accessToken, {
    maxAge: config.JWT.accessTokenExpiresIn,
  })
  return token.userId
}

export const verifyAuthTokens = (req: Request, res: Response) => {
  let userId = verifyAccessToken(req)

  if (!userId) {
    try {
      userId = verifyRefreshToken(req, res)
    } catch (error) {
      throw new AppError("Unauthorized", 401)
    }
  }

  return userId
}

export const signAuthTokens = (userId: string) => {
  const refreshToken = signToken({
    data: { userId },
    options: {
      algorithm: "HS256",
      expiresIn: config.JWT.refreshTokenExpiresIn,
    },
    secret: config.JWT.secret,
  })
  const accessToken = signToken({
    data: { userId },
    options: { algorithm: "HS256", expiresIn: config.JWT.accessTokenExpiresIn },
    secret: config.JWT.secret,
  })

  return { refreshToken, accessToken }
}

export const signTokenAndSend = (
  res: Response,
  user: IUserDocument,
  statusCode: number
) => {
  const tokens = signAuthTokens(user._id.toString())
  Object.entries(tokens).forEach(([key, value]) => {
    setCookie(res, key, value, {
      maxAge:
        config.JWT[
          `${key}ExpiresIn` as "refreshTokenExpiresIn" | "accessTokenExpiresIn"
        ],
    })
  })

  sendResponse({
    res,
    status: "success",
    statusCode: statusCode,
    data: { _id: user._id, email: user.email ?? "" },
  })
}
