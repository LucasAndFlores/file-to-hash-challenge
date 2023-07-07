import { file_to_hash } from "@prisma/client";
import { IDataFromController } from "../interface/IDataFromController";
import Container, { Service } from "typedi";
import { FileToHashRepository } from "../repository/FileToHashRepository";

@Service()
export class ImageToHashLogic {
  private fileToHashRepository: FileToHashRepository;

  constructor() {
    this.fileToHashRepository = Container.get(FileToHashRepository);
  }
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
