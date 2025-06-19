import { NextFunction, Request, Response } from "express"

import logger from "@/utils/logger"

interface IError extends Error {
  isOperational?: string
  status?: string
  code?: number
  statusCode?: number
}

// function handleDBCastError(err: IError) {
//   return new AppError(`Invalid ${err.path}: ${err.value}`, 400)
// }

// function handleJsonWebTokenError() {
//   return new AppError("Invalid Authentication Token", 401)
// }

// function handleTokenExpiredError() {
//   return new AppError("Login session expired. Login Again", 401)
// }

// function handleDuplicateFieldError(req: Request) {
//   if (req.originalUrl.endsWith("/signup") || req.originalUrl.endsWith("/login"))
//     return new AppError("Email or username already exits", 400)
// }

// function handleValidationError(err: MongooseError) {
//   const validationErrors = Object.values(err.errors).map(e => e.message)
//   validationErrors.join(",")

//   return new AppError(validationErrors.join(","), 400)
// }

// (MulterError):
//     message: "File too large"
//     code: "LIMIT_FILE_SIZE"
//     field: "image"

function handleDevError(error: IError, res: Response) {
  logger.error(error, "error handler")

  res.status(error.statusCode ?? 500).json({
    status: error.status ?? "fail",
    error: {
      message: error.message ?? "something went wrong",
      statusCode: error.statusCode ?? 500,
      stack: error.stack,
    },
  })
}

function handleProdError(error: IError, res: Response) {
  // handle internal, jwt and db errors

  // if(error.name === "JsonWebTokenError")
  // if(error.name === "TokenExpiredError")

  res.status(error.statusCode ?? 500).json({
    status: error.status ?? "fail",
    error: {
      message: error.message ?? "something went wrong",
      code: error.statusCode,
    },
  })
}

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: IError = { ...err, name: err.name, message: err.message }

  if (process.env.NODE_ENV === "development") handleDevError(error, res)

  if (process.env.NODE_ENV === "production") {
    // if (error.name === "CastError") error = handleDBCastError(error)

    // if (error.name === "JsonWebTokenError") error = handleJsonWebTokenError()

    // if (error.name === "TokenExpiredError") error = handleTokenExpiredError()

    // if (error.name === "ValidatorError") error = handleValidationError()

    // if (error.code === 11000) error = handleDuplicateFieldError(req)

    handleProdError(error, res)
  }

  next()
}

export default errorHandler
