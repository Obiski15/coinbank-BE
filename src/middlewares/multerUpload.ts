import multer, { memoryStorage } from "multer"

import AppError from "@/utils/AppError"

const multerUpload = multer({
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    // if image file type is accepted
    if (["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype))
      return cb(null, true)

    cb(new AppError("Invalid file format", 400))
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

export default multerUpload
