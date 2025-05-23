import { NextFunction, Request } from "express"

import AppError from "./AppError"

export default function jwtToken(req: Request, next: NextFunction): string {
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
