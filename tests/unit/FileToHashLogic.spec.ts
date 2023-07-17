import { jest } from "@jest/globals";

import { createHash } from "crypto";
import { DatabaseError } from "../../src/error/DatabaseError";
import { FileToHashRepositoryInMemory } from "../mocks/FileToHashRepositoryInMemory";
import { FileToHashLogic } from "../../src/logic/FileToHashLogic";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

let fileToHashLogic: FileToHashLogic;
let fileToHashRepositoryInMemory: FileToHashRepositoryInMemory;

const mockedDate = new Date("2023-07-05T15:02:24.871Z");
const mockedId = 6;

async function generateHashAndSizeInBytes() {
  const hash = createHash("sha1");

  let sizeInBytes = 0;

  await pipeline(
    Readable.from(["unit_test"]),
    async function* (stream) {
      for await (const data of stream) {
        sizeInBytes += data.length;
        yield data;
      }
    },
    hash,
  );

  const generatedHash = hash.digest("hex");

  return {
    hash: generatedHash,
    sizeInBytes,
  };
}

describe("File to hash logic unit test", () => {
  beforeEach(() => {
    fileToHashRepositoryInMemory = new FileToHashRepositoryInMemory();
    jest.spyOn(Math, "random").mockReturnValue(mockedId);
    jest.spyOn(global, "Date").mockReturnValue(mockedDate);

    fileToHashLogic = new FileToHashLogic(fileToHashRepositoryInMemory);
  });

  it("Should be able to store a hash and sizeInBytes if the data is not present on the database", async () => {
    const mockedReadableStream = Readable.from(["unit_test"]);

    const { hash, sizeInBytes } = await generateHashAndSizeInBytes();

    const expectedResult = {
      createdAt: mockedDate,
      hash: hash,
      id: mockedId,
      size_in_bytes: `${sizeInBytes}`,
    };

    const spyFindMethodFileToHashRepository = jest.spyOn(
      fileToHashRepositoryInMemory,
      "find",
    );

    const spyInsertMethodFileToHashRepository = jest.spyOn(
      fileToHashRepositoryInMemory,
      "insert",
    );

    const result = await fileToHashLogic.execute(mockedReadableStream);

    expect(result).toStrictEqual(expectedResult);
    expect(spyFindMethodFileToHashRepository).toHaveBeenCalledTimes(1);
    expect(spyFindMethodFileToHashRepository).toHaveBeenCalledWith(hash);
    expect(spyInsertMethodFileToHashRepository).toHaveBeenCalledTimes(1);
    expect(spyInsertMethodFileToHashRepository).toHaveBeenCalledWith(
      hash,
      sizeInBytes,
    );
  });

  it("Should be able to get a database record if it is already present", async () => {
    const mockedReadableStream = Readable.from(["unit_test"]);

    const { hash, sizeInBytes } = await generateHashAndSizeInBytes();

    const expectedResult = {
      createdAt: mockedDate,
      hash: hash,
      id: mockedId,
      size_in_bytes: `${sizeInBytes}`,
    };

    await fileToHashRepositoryInMemory.insert(hash, sizeInBytes);

    const spyFindMethodFileToHashRepository = jest.spyOn(
      fileToHashRepositoryInMemory,
      "find",
    );

    const spyInsertMethodFileToHashRepository = jest.spyOn(
      fileToHashRepositoryInMemory,
      "insert",
    );

    const result = await fileToHashLogic.execute(mockedReadableStream);

    expect(result).toStrictEqual(expectedResult);
    expect(spyFindMethodFileToHashRepository).toHaveBeenCalledTimes(1);
    expect(spyFindMethodFileToHashRepository).toHaveBeenCalledWith(hash);
    expect(spyInsertMethodFileToHashRepository).not.toHaveBeenCalled();
  });

  it("If an error happens inside the repository, the error should be propagated to the controller", async () => {
    const mockedReadableStream = Readable.from(["unit_test"]);

    jest.spyOn(fileToHashRepositoryInMemory, "find").mockImplementation(() => {
      throw new DatabaseError("error in repository");
    });

    expect(async () => {
      await fileToHashLogic.execute(mockedReadableStream);
    }).rejects.toBeInstanceOf(DatabaseError);
  });
});
