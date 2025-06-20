import config from "@/config"
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import sharp from "sharp"

import AppError from "./AppError"

cloudinary.config({
  cloud_name: config.CLOUDINARY.cloudName,
  api_key: config.CLOUDINARY.apiKey,
  api_secret: config.CLOUDINARY.apiSecret,
})

const uploadImage = async (fileBuffer: Buffer, userId: string) => {
  const resizedBuffer = await sharp(fileBuffer)
    .resize(196, 196, {
      fit: "cover", // Ensures the image fills 196x196
      withoutEnlargement: true, // Prevents upscaling smaller images
    })
    .png({
      compressionLevel: 9, // 0 (fastest, largest) to 9 (slowest, smallest)
      quality: 100, // for image quality tuning
      adaptiveFiltering: true,
      force: true,
    })
    .toBuffer()

  const result: UploadApiResponse | undefined = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "coinbank", public_id: userId },
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
        .end(resizedBuffer)
    }
  )

  return result?.secure_url
}

export default uploadImage
