import { NextFunction, Request, Response } from "express";

export function validateHeaderContentType(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (
    request.headers["content-type"] &&
    request.headers["content-type"].includes("multipart/form-data")
  ) {
    next();
  } else {
    response.status(404);
    response.end();
  }
}
