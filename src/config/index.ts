// Validate required environment variables
if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables.")
}

if (!process.env.MONGO_URL || !process.env.MONGO_PASSWORD) {
  throw new Error(
    "MONGO URL or PASSWORD is not defined in the environment variables."
  )
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.")
}

const config: {
  port: number
  nodeEnv: string
  mongoUrl: string
  jwtSecret: string
} = {
  port: +process.env.PORT,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUrl: process.env.MONGO_URL.replace(
    "%PASSWORD%",
    process.env.MONGO_PASSWORD
  ),
  jwtSecret: process.env.JWT_SECRET,
}

export default config
