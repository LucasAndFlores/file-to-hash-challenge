import express, { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { validateHeaderContentType } from "./middleware/validateHeaderContentType";
import { FileToHashController } from "./controller/FileToHashController";
const app = express();

app.post(
  "/",
  validateHeaderContentType,
  async (request: Request, response: Response, next: NextFunction) => {
    const controller = Container.get(FileToHashController);
    await controller.handle(request, response, next);
    return;
  }
);

export { app };
