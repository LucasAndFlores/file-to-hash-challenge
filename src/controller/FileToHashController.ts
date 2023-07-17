import { Request, Response } from "express";
import { DatabaseError } from "../error/DatabaseError";
import { FileToHashLogic } from "../logic/FileToHashLogic";

export class FileToHashController {
  constructor(private logic: FileToHashLogic) {}

  async handle(request: Request, response: Response) {
    try {
      const result = await this.logic.execute(request);

      response.json({ hash: result.hash, size: result.size_in_bytes });
    } catch (error) {
      if (error instanceof DatabaseError) {
        console.error(error.message);
        response.status(503);
        response.end();
      } else {
        console.error(`An unkown error happened: ${error}`);
        response.status(500);
        response.json({ message: "something broke" });
      }
    }
  }
}
