import express, { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { ImageToHashController } from "./controller/ImageToHashController";
import { validateHeaderContentType } from "./middleware/validateHeaderContentType";
const app = express();

app.post(
  "/",
  validateHeaderContentType,
  async (request: Request, response: Response, next: NextFunction) => {
    const controller = Container.get(ImageToHashController);
    await controller.handle(request, response, next);
    return;
  }
);

export { app };
