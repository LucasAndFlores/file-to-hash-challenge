import { createHash } from "crypto";
import { NextFunction, Request, Response } from "express";
import { pipeline } from "stream/promises";
import Container, { Service } from "typedi";
import { DatabaseError } from "../error/DatabaseError";
import { FileToHashLogic } from "../logic/FileToHashLogic";

@Service()
export class FileToHashController {
  logic: FileToHashLogic;

  constructor() {
    this.logic = Container.get(FileToHashLogic);
  }

  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const hash = createHash("sha1");

      let sizeInBytes = 0;

      await pipeline(
        request,
        async function* (stream) {
          for await (const data of stream) {
            sizeInBytes += data.length;
            yield data;
          }
        },
        hash
      );

      const generatedHash = hash.digest("hex");
      const result = await this.logic.execute({
        hash: generatedHash,
        sizeInBytes,
      });

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
