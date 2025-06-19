import { NextFunction, Request, Response } from "express"

import User from "@/models/user.model"

import { IUpdateUserSchema } from "@/schema/user.schema"

import catchAsync from "@/utils/catchAsync"
import sendResponse from "@/utils/sendResponse"
import uploadImage from "@/utils/uploadImage"

export const getUser = catchAsync(
  async (req: Request, res, next: NextFunction) => {
    const user = await User.findById(res.locals.user._id)

    sendResponse({ res, message: "success", statusCode: 200, data: user })
  }
)

export const updateUser = catchAsync(
  async (
    req: Request<unknown, unknown, IUpdateUserSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    let image: string | undefined
    if (req.file) {
      // upload image to cloud if image is present
      image = await uploadImage(req.file.buffer, res.locals.user._id as string)
    }

    // update user
    const user = await User.findByIdAndUpdate(
      res.locals.user._id,
      {
        ...req.body,
        image,
      },
      { new: true, runValidators: true }
    ).lean()

    sendResponse({ res, message: "success", statusCode: 200, data: user })
  }
)

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // delete user
    await User.findOneAndDelete(res.locals.user._id)

    // soft delete user, do not clear user's entire information

    sendResponse({ res, message: "success", statusCode: 204 })
  }
)
