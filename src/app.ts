import cookieParser from "cookie-parser"
import express, { Application } from "express"
import morgan from "morgan"

import errorHandler from "@/utils/errorHandler"

const app: Application = express()

app.use(morgan("dev"))

app.use(express.json())

app.use(cookieParser())

app.use(errorHandler)

export default app
