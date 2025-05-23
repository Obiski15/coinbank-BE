interface IConfig {
  port: number
  nodeEnv: string
  mongoUrl: string
  jwtSecret: string
  jwtSecretExpires: number
  saltWorkFactor: number
  allowedOrigins: string[]
  cloudinaryApiSecret: string
  cloudinaryApiKey: string
  cloudinaryCloudName: string
}

// Validate required environment variables
if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables.")
}

if (!process.env.MONGO_URL || !process.env.MONGO_PASSWORD) {
  throw new Error(
    "MONGO URL or PASSWORD is not defined in the environment variables."
  )
}

if (!process.env.JWT_SECRET || !process.env.JWT_SECRET_EXPIRES) {
  throw new Error(
    "JWT_SECRET or JWT_SECRET_EXPIRES is not defined in the environment variables."
  )
}

if (!process.env.ALLOWED_ORIGINS) {
  throw new Error(
    "ALLOWED ORIGINS is not defined in the environment variables."
  )
}

if (
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing cloudinary credentials")
}

const config: IConfig = {
  port: +process.env.PORT,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUrl: process.env.MONGO_URL.replace(
    "%PASSWORD%",
    process.env.MONGO_PASSWORD
  ),
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretExpires: +process.env.JWT_SECRET_EXPIRES,
  allowedOrigins: process.env.ALLOWED_ORIGINS!.split(","),
  saltWorkFactor: 10,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
}

export default config
