import "reflect-metadata";

import { jest } from "@jest/globals";

import { ImageToHashLogic } from "../../src/logic/ImageToHashLogic";
import { ImageToHashRepositoryInMemory } from "../mocks/ImageToHashRepositoryInMemory";
import Container from "typedi";
import { createHash } from "crypto";
import { DatabaseError } from "../../src/error/DatabaseError";

let imageToHashLogic: ImageToHashLogic;
let imageToHashRepositoryInMemory: ImageToHashRepositoryInMemory;

const mockedDate = new Date("2023-07-05T15:02:24.871Z");
const mockedId = 6;
const hash = createHash("sha1");
hash.update("test");
const generatedHash = hash.digest("hex");
const mockedSize = 1234;

describe("Image to hash logic unit test", () => {
  beforeEach(() => {
    imageToHashRepositoryInMemory = new ImageToHashRepositoryInMemory();

    jest.spyOn(Container, "get").mockImplementation((container) => {
      if (container.name === "ImageToHashRepository") {
        return imageToHashRepositoryInMemory;
      }
    });

    jest.spyOn(Math, "random").mockReturnValue(mockedId);
    jest.spyOn(global, "Date").mockReturnValue(mockedDate);

    imageToHashLogic = new ImageToHashLogic();
  });

  it("Should be able to store a hash and sizeInBytes if the data is not present on the database", async () => {
    const expectedResult = {
      createdAt: mockedDate,
      hash: generatedHash,
      id: mockedId,
      size_in_bytes: `${mockedSize}`,
    };

    const spyFindMethodImageToHashRepository = jest.spyOn(
      imageToHashRepositoryInMemory,
      "find"
    );

    const spyInsertMethodImageToHashRepository = jest.spyOn(
      imageToHashRepositoryInMemory,
      "insert"
    );

    const result = await imageToHashLogic.execute({
      hash: generatedHash,
      sizeInBytes: mockedSize,
    });

    expect(result).toStrictEqual(expectedResult);
    expect(spyFindMethodImageToHashRepository).toHaveBeenCalledTimes(1);
    expect(spyFindMethodImageToHashRepository).toHaveBeenCalledWith(
      generatedHash
    );
    expect(spyInsertMethodImageToHashRepository).toHaveBeenCalledTimes(1);
    expect(spyInsertMethodImageToHashRepository).toHaveBeenCalledWith(
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

    await imageToHashRepositoryInMemory.insert(generatedHash, mockedSize);

    const spyFindMethodImageToHashRepository = jest.spyOn(
      imageToHashRepositoryInMemory,
      "find"
    );

    const spyInsertMethodImageToHashRepository = jest.spyOn(
      imageToHashRepositoryInMemory,
      "insert"
    );

    const result = await imageToHashLogic.execute({
      hash: generatedHash,
      sizeInBytes: mockedSize,
    });

    expect(result).toStrictEqual(expectedResult);
    expect(spyFindMethodImageToHashRepository).toHaveBeenCalledTimes(1);
    expect(spyFindMethodImageToHashRepository).toHaveBeenCalledWith(
      generatedHash
    );
    expect(spyInsertMethodImageToHashRepository).not.toHaveBeenCalled();
  });

  it("If an error happens inside the repository, the error should be propagated to the controller", async () => {
    jest.spyOn(imageToHashRepositoryInMemory, "find").mockImplementation(() => {
      throw new DatabaseError("error in repository");
    });

    const spyFindMethodImageToHashRepository = jest.spyOn(
      imageToHashRepositoryInMemory,
      "find"
    );

    expect(async () => {
      await imageToHashLogic.execute({
        hash: generatedHash,
        sizeInBytes: mockedSize,
      });
    }).rejects.toBeInstanceOf(DatabaseError);
    expect(spyFindMethodImageToHashRepository).toHaveBeenCalledTimes(1);
  });
});
