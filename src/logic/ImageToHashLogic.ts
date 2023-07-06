import { image_to_hash } from "@prisma/client";
import { IDataFromController } from "../interface/IDataFromController";
import { ImageToHashRepository } from "../repository/ImageToHashRepository";
import Container, { Service } from "typedi";

@Service()
export class ImageToHashLogic {
  private imageToHashRepository: ImageToHashRepository;

  constructor() {
    this.imageToHashRepository = Container.get(ImageToHashRepository);
  }
  async execute({
    hash,
    sizeInBytes,
  }: IDataFromController): Promise<image_to_hash> {
    const found = await this.imageToHashRepository.find(hash);

    if (found === null) {
      return await this.imageToHashRepository.insert(hash, sizeInBytes);
    }

    return found;
  }
}
