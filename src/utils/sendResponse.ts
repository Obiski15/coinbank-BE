import { Response } from "express"

interface IResponse {
  status: string
  statusCode: number
  data?: unknown
  error?: unknown
  res: Response
}

const sendResponse = ({ res, status, statusCode, data, error }: IResponse) => {
  res.status(statusCode).json({
    status,
    data,
    error,
  })
}

export default sendResponse
