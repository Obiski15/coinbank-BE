import { Response } from "express"

interface IResponse {
  message: string
  statusCode: number
  data?: unknown
  res: Response
}

const sendResponse = ({ res, message, statusCode, data }: IResponse) => {
  res.status(statusCode).json({
    message,
    data,
  })
}

export default sendResponse
