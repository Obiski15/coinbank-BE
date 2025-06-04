import { NextFunction, Request, Response } from "express"

function parseNestedFields(req: Request, res: Response, next: NextFunction) {
  // convert nested objects to match schema
  // nested object format "key.value")
  const data: Record<string, unknown> = {}

  // Object.entries(req.body).forEach(([key, value]) => {
  //   if (key.includes(".")) {
  //     const [key1, key2] = key.split(".")
  //     if (!Object.keys(data).includes(key1)) data[key1] = {}
  //     data[key1][key2] = value
  //   } else {
  //     data[key] = value
  //   }
  // })

  Object.entries(req.body).forEach(([key, value]) => {
    const keys = key.split(".")
    let current = data

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        current[k] = value
      } else {
        if (!current[k]) current[k] = {}
        current = current[k] as Record<string, unknown>
      }
    })
  })

  req.body = data
  next()
}

export default parseNestedFields
