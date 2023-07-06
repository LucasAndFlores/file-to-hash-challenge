import express, { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { ImageToHashController } from "./controller/ImageToHashController";
const app = express();

app.post(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    if (request.headers["content-type"]?.includes("multipart/form-data")) {
      const controller = Container.get(ImageToHashController);
      await controller.handle(request, response, next);
    } else {
      response.status(404);
      response.end();
    }
  }
);

export { app };
