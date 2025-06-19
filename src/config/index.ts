interface IConfig {
  port: number
  nodeEnv: string
  mongoUrl: string
  jwtSecret: string
  jwtSecretExpires: number
  jwtCookieExpires?: number
  saltWorkFactor: number
  allowedOrigins: string[]
  cloudinaryApiSecret: string
  cloudinaryApiKey: string
  cloudinaryCloudName: string
  baseURL: string
  googleClientSecret: string
  googleClientId: string
  googleRefreshToken: string
  googleAuthRedirect: string
  facebookClientSecret: string
  facebookClientId: string
  facebookAuthRedirect: string
  defaultEmailAddress: string
  mailtrapPass: string
  mailtrapUser: string
  emailVerificationTokenExpires: number
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

const config: IConfig = {
  port: +process.env.PORT,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUrl: process.env.MONGO_URL.replace(
    "%PASSWORD%",
    process.env.MONGO_PASSWORD
  ),
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretExpires: +process.env.JWT_SECRET_EXPIRES,
  jwtCookieExpires: process.env.JWT_COOKIE_EXPIRES
    ? +process.env.JWT_COOKIE_EXPIRES
    : undefined,
  allowedOrigins: !process.env.ALLOWED_ORIGINS
    ? [""]
    : process.env.ALLOWED_ORIGINS!.split(","),
  saltWorkFactor: 10,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  baseURL: process.env.BASE_URL || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN || "",
  googleAuthRedirect: process.env.GOOGLE_AUTH_REDIRECT || "",
  facebookClientSecret: process.env.FACEBOOK_APP_SECRET || "",
  facebookClientId: process.env.FACEBOOK_APP_ID || "",
  facebookAuthRedirect: process.env.FACEBOOK_AUTH_REDIRECT || "",
  mailtrapPass: process.env.MAIL_TRAP_PASS || "",
  mailtrapUser: process.env.MAIL_TRAP_USER || "",
  defaultEmailAddress: process.env.DEFAULT_EMAIL_ADDRESS || "",
  emailVerificationTokenExpires: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN
    ? +process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN
    : 0,
}

export default config
