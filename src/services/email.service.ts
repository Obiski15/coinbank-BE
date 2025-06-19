import config from "@/config"
import nodemailer, { SendMailOptions, Transporter } from "nodemailer"

import AppError from "@/utils/AppError"
import logger from "@/utils/logger"

let transporter: Transporter

function createTransporter(): Transporter {
  if (config.nodeEnv === "development") {
    return nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: config.mailtrapUser,
        pass: config.mailtrapPass,
      },
    })
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "me@gmail.com",
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
      refreshToken: config.googleRefreshToken,
    },
  })
}

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = createTransporter()
  }
  return transporter
}

async function sendMail({ from, to, html, subject, ...rest }: SendMailOptions) {
  try {
    const result = await getTransporter().sendMail({
      from,
      to,
      subject,
      html,
      ...rest,
    })
    return result
  } catch (error) {
    logger.error(error)
    throw new AppError("Failed to send mail", 500)
  }
}

export default sendMail
