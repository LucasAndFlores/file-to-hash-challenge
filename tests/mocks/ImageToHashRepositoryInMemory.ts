import { DatabaseError } from "../../src/error/DatabaseError";
import { IImageToHashRepository } from "../../src/interface/IImageToHashRepository";
import { Prisma, image_to_hash } from "@prisma/client";

export class ImageToHashRepositoryInMemory implements IImageToHashRepository {
  private database: Map<string, image_to_hash>;

  constructor() {
    this.database = new Map();
  }

  find(hash: string): Promise<image_to_hash | null> {
    try {
      const found = this.database.get(hash);

      if (!found) {
        return null as unknown as Promise<null>;
      }

      return found as unknown as Promise<image_to_hash>;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DatabaseError(
          `A prisma error happened on find method: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }

  insert(hash: string, sizeInBytes: number): Promise<image_to_hash> {
    try {
      this.database.set(hash, {
        id: Math.random(),
        size_in_bytes: `${sizeInBytes}`,
        hash,
        createdAt: new Date(),
      });

      return this.database.get(hash) as unknown as Promise<image_to_hash>;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DatabaseError(
          `A prisma error happened on insert method: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }
}
