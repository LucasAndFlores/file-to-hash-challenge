import { Response } from "express";
import { DatabaseError } from "./DatabaseError";
import { EErrorStatusCode } from "../enum/EErrorStatusCode";

export function handleError(error: unknown, response: Response) {
  if (error instanceof DatabaseError) {
    console.error(error.message);
    response.status(EErrorStatusCode.SERVICE_UNAVAILABLE);
    response.end();
  } else {
    console.error(`An unkown error happened: ${error}`);
    response.status(EErrorStatusCode.INTERNAL_SERVER_ERROR);
    response.json({ message: "something broke" });
  }
}
