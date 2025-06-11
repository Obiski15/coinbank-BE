import config from "@/config"
import { CookieOptions, Response } from "express"

export default (
  res: Response,
  name: string,
  value: string,
  expires?: number
) => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    maxAge: expires ? Date.now() + expires : undefined,
  }

  res.cookie(name, value, cookieOptions)
}
