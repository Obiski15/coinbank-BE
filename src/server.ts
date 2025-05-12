process.on("uncaughtException", err => {
  console.log("UNCAUGHT_EXCEPTION 💥")
  console.log("shutting down...")
  console.error(err.message)
  process.exit(1)
})
;(async () => {
  await import("@/config/load-env")
  const { default: connectDB } = await import("@/config/connectDB")
  const { default: config } = await import("@/config/index")
  const { default: app } = await import("@/app")

  await connectDB()
  const server = app.listen(config.port, () => {
    console.log(`App running on port ${config.port}`)
  })

  process.on("unhandledRejection", err => {
    console.log("UNHANDLED_REJECTION 💣")
    console.log("shutting down....")
    console.error(err)
    server.close(() => {
      process.exit(1)
    })
  })
})()
