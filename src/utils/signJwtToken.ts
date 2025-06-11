import config from "@/config"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"

export default (userId: string | Types.ObjectId) =>
  jwt.sign({ userId: userId }, config.jwtSecret, {
    expiresIn: `${config.jwtSecretExpires}d`,
  })
