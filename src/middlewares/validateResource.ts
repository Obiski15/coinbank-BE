import { NextFunction, Request, Response } from "express"
import { ZodIssue, ZodTypeAny } from "zod"

import AppError from "@/utils/AppError"
import catchAsync from "@/utils/catchAsync"

const handleValidationError = (errors: ZodIssue[]): string => {
  return errors
    .map(err => `${err.path[err.path.length - 1] ?? ""}: ${err.message}`)
    .join(", ")
}

const validateResource: (
  schema: ZodTypeAny
) => (req: Request, res: Response, next: NextFunction) => Promise<void> = (
  schema: ZodTypeAny
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const safeParse = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    })

    if (!safeParse.success)
      throw new AppError(handleValidationError(safeParse?.error?.errors), 400)

    next()
  })

export default validateResource
