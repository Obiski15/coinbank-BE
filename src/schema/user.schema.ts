import { coerce, object, string, TypeOf } from "zod"

export const loginSchema = object({
  body: object({
    email: string({ required_error: "Email address is required" })
      .trim()
      .email({ message: "Please enter a valid email address" }),

    password: string({ required_error: "Password is required" }).min(
      8,
      "Password must be at least 8 characters long"
    ),
  }),
})

export const registerSchema = object({
  body: object({
    display_name: string().min(1, {
      message: "Please provide a valid display_name",
    }),

    email: string({ required_error: "Email address is required" })
      .trim()
      .email({ message: "Please enter a valid email address" }),

    password: string({ required_error: "Password is required" }).min(
      8,
      "Password must be at least 8 characters long"
    ),

    confirm_password: string({
      required_error: "Confirm password is required",
    }).min(8, "Password must be at least 8 characters long"),
  }),
}).refine(data => data.body.password === data.body.confirm_password, {
  message: "Password don't match",
  path: ["confirm_password"],
})

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Email address is required" })
      .trim()
      .email({ message: "Please enter a valid email address" }),
  }),
})

export const resetPasswordSchema = object({
  body: object({
    resetToken: string({ required_error: "Reset token is required" }).min(1, {
      message: "Please provide a valid reset token",
    }),

    password: string({ required_error: "Password is required" }).min(
      8,
      "Password must be at least 8 characters long"
    ),

    confirm_password: string({
      required_error: "Confirm password is required",
    }).min(8, "Password must be at least 8 characters long"),
  }),
}).refine(data => data.body.password === data.body.confirm_password, {
  message: "Password don't match",
  path: ["confirm_password"],
})

export const updatePasswordSchema = object({
  body: object({
    current_password: string({
      required_error: "Current password is required",
    }),

    password: string({ required_error: "Password is required" }).min(
      8,
      "Password must be at least 8 characters long"
    ),

    confirm_password: string({ required_error: "Password is required" }).min(
      8,
      "Password must be at least 8 characters long"
    ),
  }),
}).refine(data => data.body.password === data.body.confirm_password, {
  message: "Password don't match",
  path: ["confirm_password"],
})

export const updateUserSchema = object({
  body: object({
    display_name: string().min(1, {
      message: "Please provide a valid display_name",
    }),
    personal: object({
      first_name: string({
        required_error: "Please enter your first name",
      }).min(1, {
        message: "Please provide a valid first name",
      }),
      last_name: string({
        required_error: "Please enter your Last name",
      }).min(1, {
        message: "Please provide a valid last name",
      }),
      country: string({
        required_error: "Kindly provide a country name",
      }).min(1, {
        message: "Please provide a valid country name",
      }),
      dob: coerce.date({
        required_error: "Kindly select your date of birth",
        invalid_type_error: "Invalid date format",
      }),
    }),
  }),
})

// schema types
export type IRegisterSchema = TypeOf<typeof registerSchema>
export type ILoginSchema = TypeOf<typeof loginSchema>
export type IResetPasswordSchema = TypeOf<typeof resetPasswordSchema>
export type IForgotPasswordSchema = TypeOf<typeof forgotPasswordSchema>
export type IUpdatePasswordSchema = TypeOf<typeof updatePasswordSchema>
export type IUpdateUserSchema = TypeOf<typeof updateUserSchema>
