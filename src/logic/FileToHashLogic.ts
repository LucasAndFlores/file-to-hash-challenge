import { file_to_hash } from "@prisma/client";
import { pipeline } from "stream/promises";
import { createHash } from "crypto";
import { IFileToHashRepository } from "../interface/IFileToHashRepository";
import { Readable } from "stream";

export class FileToHashLogic {
  constructor(private fileToHashRepository: IFileToHashRepository) {}
  async execute(request: Readable): Promise<file_to_hash> {
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
      hash,
    );

    const generatedHash = hash.digest("hex");

    const found = await this.fileToHashRepository.find(generatedHash);

    if (found === null) {
      return await this.fileToHashRepository.insert(generatedHash, sizeInBytes);
    }

    return found;
  }
}
