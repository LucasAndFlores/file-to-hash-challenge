import { image_to_hash } from "@prisma/client";

export interface IImageToHashRepository {
  find(hash: string): Promise<image_to_hash | null | undefined>;
  insert(hash: string, sizeInBytes: number): Promise<image_to_hash | undefined>;
}
