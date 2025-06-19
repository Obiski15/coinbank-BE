import crypto from "crypto"
import config from "@/config"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"

import createHashToken from "@/utils/createHash"

import { IUserDocument } from "./types"

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    display_name: { type: String, trim: true, lowercase: true },
    image: { type: String },
    personal: {
      first_name: { type: String, trim: true, lowercase: true },
      last_name: { type: String, trim: true, lowercase: true },
      country: { type: String, trim: true },
      dob: {
        type: Date,
      },
      phone: {
        code: { type: Number },
        number: { type: Number },
      },
    },
    email: {
      type: String,
      required: [true, "Login email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Minimum password length is 8"],
      select: false,
    },
    confirm_password: {
      type: String,
      required: [true, "Please confirm your password"],
      minLength: [8, "Minimum password length is 8"],
    },
    password_reset_token: String,
    password_reset_token_expires_at: Date,
    email_verification_token: String,
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (next) {
  // check if password is modified.
  if (!this.isModified("password")) next()

  // replace password with bcrypt hash
  this.password = await bcrypt.hash(this.password, config.saltWorkFactor)

  // exclude confirm_password field
  this.confirm_password = undefined

  next()
})

userSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(userPassword, this.password)
}

userSchema.methods.createResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex")

  this.password_reset_token = createHashToken(token)
  this.password_reset_token_expires_at = new Date(Date.now() + 900000)

  return token
}

const User = mongoose.model<IUserDocument>("User", userSchema)

export default User
