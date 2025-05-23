import config from "@/config"
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"

import AppError from "./AppError"

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
})

const uploadImage = async (fileBuffer: Buffer) => {
  const result: UploadApiResponse | undefined = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "coinbank", public_id: "coinbank" },
          (error, uploadResult) => {
            if (error)
              return reject(
                new AppError(
                  "Something went wrong while trying to upload your image",
                  500
                )
              )

            return resolve(uploadResult)
          }
        )
        .end(fileBuffer)
    }
  )

  return result?.secure_url
}

export default uploadImage
