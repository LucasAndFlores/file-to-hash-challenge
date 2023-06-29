import express, { Request, Response } from "express"

const app = express()

app.get("/", (request: Request, response: Response) => {
  return response.json({ key: "value" })
})

export { app }
