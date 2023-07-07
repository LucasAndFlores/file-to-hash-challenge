import { file_to_hash } from "@prisma/client";

export interface IFileToHashRepository {
  find(hash: string): Promise<file_to_hash | null>;
  insert(hash: string, sizeInBytes: number): Promise<file_to_hash>;
}
