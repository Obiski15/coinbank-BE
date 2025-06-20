interface IConfig {
  port: number
  nodeEnv: string
  baseURL: string
  AUTH: {
    saltWorkFactor: number
    emailVerificationTokenExpires: number
  }
  CORS: {
    allowedOrigins: string[]
  }
  MAILTRAP: { pass: string; user: string; default: { email: string } }
  FACEBOOK: {
    clientSecret: string
    clientId: string
    authRedirect: string
  }
  GOOGLE: {
    clientSecret: string
    clientId: string
    refreshToken: string
    authRedirect: string
  }
  CLOUDINARY: {
    apiSecret: string
    apiKey: string
    cloudName: string
  }
  MONGO: {
    uri: string
  }
  JWT: {
    refreshTokenExpiresIn: number
    accessTokenExpiresIn: number
    secret: string
  }
}

// Validate required environment variables
if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables.")
}

if (!process.env.MONGO_URI || !process.env.MONGO_PASSWORD) {
  throw new Error(
    "MONGO URI or PASSWORD is not defined in the environment variables."
  )
}

if (
  !process.env.JWT_SECRET ||
  !process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ||
  !process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
) {
  throw new Error(
    "Either JWT_SECRET, JWT_TOKEN_EXPIRATION or JWT_TOKEN_COOKIE_EXPIRATION is not defined in the environment variables."
  )
}

const config: IConfig = {
  port: +process.env.PORT,
  nodeEnv: process.env.NODE_ENV || "development",
  baseURL: process.env.BASE_URL || "",
  AUTH: {
    saltWorkFactor: 10,
    emailVerificationTokenExpires: process.env
      .EMAIL_VERIFICATION_TOKEN_EXPIRES_IN
      ? +process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN
      : 0,
  },
  CORS: {
    allowedOrigins: !process.env.ALLOWED_ORIGINS
      ? [""]
      : process.env.ALLOWED_ORIGINS!.split(","),
  },
  MAILTRAP: {
    default: {
      email: process.env.DEFAULT_EMAIL_ADDRESS || "",
    },
    pass: process.env.MAIL_TRAP_PASS || "",
    user: process.env.MAIL_TRAP_USER || "",
  },
  GOOGLE: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN || "",
    authRedirect: process.env.GOOGLE_AUTH_REDIRECT || "",
  },
  FACEBOOK: {
    clientSecret: process.env.FACEBOOK_APP_SECRET || "",
    clientId: process.env.FACEBOOK_APP_ID || "",
    authRedirect: process.env.FACEBOOK_AUTH_REDIRECT || "",
  },
  CLOUDINARY: {
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  },
  MONGO: {
    uri: process.env.MONGO_URI.replace(
      "%PASSWORD%",
      process.env.MONGO_PASSWORD
    ),
  },
  JWT: {
    secret: process.env.JWT_SECRET,
    refreshTokenExpiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    accessTokenExpiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  },
}

export default config
