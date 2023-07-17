import express, { NextFunction, Request, Response } from "express";
import { validateHeaderContentType } from "./middleware/validateHeaderContentType";
import { FileToHashFactory } from "./factory/FileToHashFactory";
const app = express();
const controller = FileToHashFactory.build();

app.post(
  "/",
  validateHeaderContentType,
  async (request: Request, response: Response) => {
    await controller.handle(request, response);
    return;
  },
);

export { app };
