import mongoose from "mongoose"

import logger from "@/utils/logger"
import config from "@/config/index"

export default async function connectDB() {
  await mongoose.connect(config.MONGO.uri, { dbName: "coinbank" })
  logger.info("connection successfull")
}
