import { file_to_hash } from "@prisma/client";
import { IDataFromController } from "../interface/IDataFromController";
import { IFileToHashRepository } from "../interface/IFileToHashRepository";

export class FileToHashLogic {
  constructor(private fileToHashRepository: IFileToHashRepository) {}
  async execute({
    hash,
    sizeInBytes,
  }: IDataFromController): Promise<file_to_hash> {
    const found = await this.fileToHashRepository.find(hash);

    if (found === null) {
      return await this.fileToHashRepository.insert(hash, sizeInBytes);
    }

    return found;
  }
}
