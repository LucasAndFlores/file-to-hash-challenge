import express, { NextFunction, Request, Response } from "express";
import { validateHeaderContentType } from "./middleware/validateHeaderContentType";
import { FileToHashFactory } from "./factory/FileToHashFactory";
const app = express();
const controller = FileToHashFactory.build();

app.post(
  "/",
  validateHeaderContentType,
  async (request: Request, response: Response, next: NextFunction) => {
    await controller.handle(request, response, next);
    return;
  },
);

export { app };
