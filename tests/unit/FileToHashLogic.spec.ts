import "reflect-metadata";

import { jest } from "@jest/globals";

import Container from "typedi";
import { createHash } from "crypto";
import { DatabaseError } from "../../src/error/DatabaseError";
import { FileToHashRepositoryInMemory } from "../mocks/FileToHashRepositoryInMemory";
import { FileToHashLogic } from "../../src/logic/FileToHashLogic";

let fileToHashLogic: FileToHashLogic;
let fileToHashRepositoryInMemory: FileToHashRepositoryInMemory;

const mockedDate = new Date("2023-07-05T15:02:24.871Z");
const mockedId = 6;
const hash = createHash("sha1");
hash.update("test");
const generatedHash = hash.digest("hex");
const mockedSize = 1234;

describe("File to hash logic unit test", () => {
  beforeEach(() => {
    fileToHashRepositoryInMemory = new FileToHashRepositoryInMemory();

    jest.spyOn(Container, "get").mockImplementation((container) => {
      if (container.name === "FileToHashRepository") {
        return fileToHashRepositoryInMemory;
      }
    });

    jest.spyOn(Math, "random").mockReturnValue(mockedId);
    jest.spyOn(global, "Date").mockReturnValue(mockedDate);

    fileToHashLogic = new FileToHashLogic();
  });

  it("Should be able to store a hash and sizeInBytes if the data is not present on the database", async () => {
    const expectedResult = {
      createdAt: mockedDate,
      hash: generatedHash,
      id: mockedId,
      size_in_bytes: `${mockedSize}`,
    };

    const spyFindMethodFileToHashRepository = jest.spyOn(
      fileToHashRepositoryInMemory,
      "find"
    );

    const spyInsertMethodFileToHashRepository = jest.spyOn(
      fileToHashRepositoryInMemory,
      "insert"
    );

    const result = await fileToHashLogic.execute({
      hash: generatedHash,
      sizeInBytes: mockedSize,
    });

    expect(result).toStrictEqual(expectedResult);
    expect(spyFindMethodFileToHashRepository).toHaveBeenCalledTimes(1);
    expect(spyFindMethodFileToHashRepository).toHaveBeenCalledWith(
      generatedHash
    );
    expect(spyInsertMethodFileToHashRepository).toHaveBeenCalledTimes(1);
    expect(spyInsertMethodFileToHashRepository).toHaveBeenCalledWith(
      generatedHash,
      mockedSize
    );
  });

  it("Should be able to get a database record if it is already present", async () => {
    const expectedResult = {
      createdAt: mockedDate,
      hash: generatedHash,
      id: mockedId,
      size_in_bytes: `${mockedSize}`,
    };

    await fileToHashRepositoryInMemory.insert(generatedHash, mockedSize);

    const spyFindMethodFileToHashRepository = jest.spyOn(
      fileToHashRepositoryInMemory,
      "find"
    );

    const spyInsertMethodFileToHashRepository = jest.spyOn(
      fileToHashRepositoryInMemory,
      "insert"
    );

    const result = await fileToHashLogic.execute({
      hash: generatedHash,
      sizeInBytes: mockedSize,
    });

    expect(result).toStrictEqual(expectedResult);
    expect(spyFindMethodFileToHashRepository).toHaveBeenCalledTimes(1);
    expect(spyFindMethodFileToHashRepository).toHaveBeenCalledWith(
      generatedHash
    );
    expect(spyInsertMethodFileToHashRepository).not.toHaveBeenCalled();
  });

  it("If an error happens inside the repository, the error should be propagated to the controller", async () => {
    jest.spyOn(fileToHashRepositoryInMemory, "find").mockImplementation(() => {
      throw new DatabaseError("error in repository");
    });

    const spyFindMethodFileToHashRepository = jest.spyOn(
      fileToHashRepositoryInMemory,
      "find"
    );

    expect(async () => {
      await fileToHashLogic.execute({
        hash: generatedHash,
        sizeInBytes: mockedSize,
      });
    }).rejects.toBeInstanceOf(DatabaseError);
    expect(spyFindMethodFileToHashRepository).toHaveBeenCalledTimes(1);
  });
});
