import { Prisma, PrismaClient, file_to_hash } from "@prisma/client";
import { Service } from "typedi";
import { DatabaseError } from "../error/DatabaseError";
import { IFileToHashRepository } from "../interface/IFileToHashRepository";

@Service()
export class FileToHashRepository implements IFileToHashRepository {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async find(hash: string): Promise<file_to_hash | null> {
    try {
      return await this.prismaClient.file_to_hash.findUnique({
        where: { hash },
      });
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

  async insert(hash: string, sizeInBytes: number): Promise<file_to_hash> {
    try {
      return await this.prismaClient.file_to_hash.create({
        data: {
          hash,
          size_in_bytes: `${sizeInBytes}`,
        },
      });
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
