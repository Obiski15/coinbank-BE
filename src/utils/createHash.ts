import crypto from "crypto"

const createHashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex")

export default createHashToken
