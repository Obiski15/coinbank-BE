import { NextFunction, Request, Response } from "express"

import User from "@/models/user.model"

import { IUpdateUserSchema } from "@/schema/user.schema"

import catchAsync from "@/utils/catchAsync"
import uploadImage from "@/utils/uploadImage"

export const getUser = catchAsync(
  async (req: Request, res, next: NextFunction) => {
    res.status(200).json({
      status: "success",
      data: {
        user: {
          ...res.locals.user,
        },
      },
    })
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
      image = await uploadImage(req.file.buffer)
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

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    })
  }
)

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // delete user
    await User.findOneAndDelete(res.locals.user._id)

    res.sendStatus(204)
  }
)
