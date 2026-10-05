import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "./app.js";
import { connectDB } from "./db.js";

beforeAll(async () => {
  await connectDB();
});

describe("GET /health", () => {
  it("returns 200 and status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("POST /signup", () => {
  it("accepts a valid signup", async () => {
    const res = await request(app)
      .post("/signup")
      .send({
        email: `test${Date.now()}@example.com`,
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Signup Completed" });
  });

  it("rejects a duplicate email", async () => {
    const email = `dup${Date.now()}@example.com`;

    await request(app).post("/signup").send({ email, password: "password123" });

    const res = await request(app)
      .post("/signup")
      .send({ email, password: "password123" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Email already in use");
  });

  it("rejects an invalid signup", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ email: "not-an-email", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid Request Body");
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
