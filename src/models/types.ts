export interface IUserDocument {
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
  reset_token?: string
  reset_token_expires_at?: Date
  comparePassword(userPassword: string): Promise<boolean>
  createResetToken(): string
  createdAt: string
  updatedAt: string
}
