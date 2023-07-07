import "reflect-metadata";

import { jest } from "@jest/globals";

import supertest from "supertest";
import { app } from "../../src/app";
import { DatabaseError } from "../../src/error/DatabaseError";
import { FileToHashRepository } from "../../src/repository/FileToHashRepository";

describe("Integration test post route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should be able to send a file and receive a hash and size in bytes as response", async () => {
    const result = await supertest(app)
      .post("/")
      .attach("file", `${__dirname}/data/test.png`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty("hash");
    expect(result.body).toHaveProperty("size");
  });

  it("If the file has already been processed, should retrieve the hash and sinzeInBytes from the database", async () => {
    await supertest(app).post("/").attach("file", `${__dirname}/data/test.png`);

    const result = await supertest(app)
      .post("/")
      .attach("file", `${__dirname}/data/test.png`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty("hash");
    expect(result.body).toHaveProperty("size");
  });

  it("Should not be able to send a request if the request is not a multipart form data", async () => {
    const result = await supertest(app)
      .post("/")
      .send(JSON.stringify({ data: "error" }));

    expect(result.statusCode).toBe(404);
  });

  it("If happens an known database error on the method find at the repository layer, the status code from the response should be 503", async () => {
    jest
      .spyOn(FileToHashRepository.prototype, "find")
      .mockImplementationOnce(() => {
        throw new DatabaseError("An error happened");
      });

    const result = await supertest(app)
      .post("/")
      .attach("file", `${__dirname}/data/test.png`);

    expect(result.statusCode).toBe(503);
  });

  it("If happens an unknown database error on the method find at the repository layer, the status code from the response should be 500", async () => {
    jest
      .spyOn(FileToHashRepository.prototype, "find")
      .mockImplementationOnce(() => {
        throw new Error("An error happened");
      });

    const result = await supertest(app)
      .post("/")
      .attach("file", `${__dirname}/data/test.png`);

    expect(result.statusCode).toBe(500);
    expect(result.body).toStrictEqual({ message: "something broke" });
  });

  it("If happens a known database error on the method insert at the repository layer, the status code from the response should be 503", async () => {
    jest
      .spyOn(FileToHashRepository.prototype, "insert")
      .mockImplementationOnce(() => {
        throw new DatabaseError("An error happened");
      });

    const result = await supertest(app)
      .post("/")
      .attach("file", `${__dirname}/data/test.png`);

    expect(result.statusCode).toBe(503);
  });

  it("If happens an unknown database error on the method insert at the repository layer, the status code from the response should be 500", async () => {
    jest
      .spyOn(FileToHashRepository.prototype, "insert")
      .mockImplementationOnce(() => {
        throw new Error("An error happened");
      });

    const result = await supertest(app)
      .post("/")
      .attach("file", `${__dirname}/data/test.png`);

    expect(result.statusCode).toBe(500);
    expect(result.body).toStrictEqual({ message: "something broke" });
  });
});
