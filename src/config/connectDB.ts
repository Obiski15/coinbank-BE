import mongoose from "mongoose"

import config from "@/config/index"

export default async function connectDB() {
  await mongoose.connect(config.mongoUrl, { dbName: "coinbank" })
  console.log("connection successfull")
}
