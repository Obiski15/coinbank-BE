import cookieParser from "cookie-parser"
import cors from "cors"
import express, { Application } from "express"
import morgan from "morgan"

import errorHandler from "@/middlewares/errorHandler"

import authRoute from "@/routes/auth.route"
import userRoute from "@/routes/user.route"

import config from "@/config/index"

const app: Application = express()

const BASE_ROUTE = "/api/v1"

app.use(morgan("dev"))

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes(origin)) {
        callback(null, origin)
      } else {
        callback(new Error("Origin not allowed. Blocked by cors...."))
      }
    },
    credentials: true,
  })
)

app.use(express.json())

app.use(cookieParser())

app.use(`${BASE_ROUTE}/user`, userRoute)
app.use(`${BASE_ROUTE}/auth`, authRoute)

app.use(errorHandler)

export default app
