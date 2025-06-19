import { Types } from "mongoose"

export interface IUserDocument {
  _id: Types.ObjectId
  googleId?: string
  facebookId?: string
  email: string
  display_name?: string
  image?: string
  personal?: {
    first_name?: string
    last_name?: string
    country?: string
    dob?: Date
    phone?: {
      code: number
      number: number
    }
  }
  password: string
  confirm_password?: string
  password_reset_token?: string
  password_reset_token_expires_at?: Date
  email_verification_token?: string
  comparePassword(userPassword: string): Promise<boolean>
  createResetToken(): string
  createdAt: string
  updatedAt: string
}
