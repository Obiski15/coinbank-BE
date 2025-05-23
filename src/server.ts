import logger from "@/utils/logger"

process.on("uncaughtException", err => {
  logger.error("UNCAUGHT_EXCEPTION 💥")
  logger.error("shutting down...")
  logger.error(err.message)

  process.exit(1)
})
;(async () => {
  await import("@/config/load-env")
  const { default: connectDB } = await import("@/config/connectDB")
  const { default: config } = await import("@/config/index")
  const { default: app } = await import("@/app")

  await connectDB()
  const server = app.listen(config.port, () => {
    logger.info(`App running on port ${config.port}`)
  })

  process.on("unhandledRejection", err => {
    logger.error("UNHANDLED_REJECTION 💣")
    logger.error("shutting down....")
    logger.error(err)
    server.close(() => {
      process.exit(1)
    })
  })
})()
