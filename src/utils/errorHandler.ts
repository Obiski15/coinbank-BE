import { NextFunction, Request, Response } from "express"

interface IError extends Error {
  isOperational?: string
  status?: string
  statusCode?: number
}

function handleDevError(error: IError, res: Response) {
  console.log(error)

  res.status(error.statusCode ?? 500).json({
    message: error.message ?? "something went wrong",
    status: error.status ?? "Fail",
    stausCode: error.statusCode ?? 500,
    stack: error.stack,
  })
}

function handleProdError(error: IError, res: Response) {
  // handle internal, jwt and db errors

  res.status(error.statusCode ?? 500).json({
    message: error.message ?? "something went wrong",
    status: error.status ?? "Fail",
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

  if (process.env.NODE_ENV === "production") handleProdError(error, res)

  next()
}

export default errorHandler
