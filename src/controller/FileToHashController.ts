import { Request, Response } from "express";
import { FileToHashLogic } from "../logic/FileToHashLogic";
import { handleError } from "../error/handleError";

export class FileToHashController {
  constructor(private logic: FileToHashLogic) {}

  async handle(request: Request, response: Response) {
    try {
      const result = await this.logic.execute(request);

      response.json({ hash: result.hash, size: result.size_in_bytes });
    } catch (error) {
      handleError(error, response);
    }
  }
}
