import { FileToHashController } from "../controller/FileToHashController";
import { FileToHashLogic } from "../logic/FileToHashLogic";
import { FileToHashRepository } from "../repository/FileToHashRepository";

export class FileToHashFactory {
  static build() {
    const repository = new FileToHashRepository();
    const logic = new FileToHashLogic(repository);
    const controller = new FileToHashController(logic);
    return controller;
  }
}
