const mongoose = require("mongoose");
const supertest = require("supertest");
const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

describe("with seeded root user", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/users", () => {
    test("creates new user with valid data", async () => {
      const user = {
        username: "huuhaakokeilu",
        name: "koklu",
        password: "salainen",
      };

      const result = await api
        .post("/api/users")
        .send(user)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const users = await User.findOne({ username: user.username });
      assert.strictEqual(result.body.username, users.username);
    });

    describe("fails", () => {
      test("if username already taken", async () => {
        await helper.createTestUser("root");

        const user = {
          username: "root",
          name: "Superuser",
          password: "secret",
        };

        const result = await api
          .post("/api/users")
          .send(user)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        assert.strictEqual(result.body.error, "username must be unique");
      });

      test("if username is too short", async () => {
        const user = {
          username: "ab",
          name: "huuhaa",
          password: "secret",
        };

        const result = await api
          .post("/api/users")
          .send(user)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        assert.strictEqual(
          result.body.error,
          "username and password must have at least 3 characters"
        );
      });

      test("if password is too short", async () => {
        const user = {
          username: "huuhaa",
          name: "kokeilu",
          password: "sa",
        };

        const result = await api
          .post("/api/users")
          .send(user)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        assert.strictEqual(
          result.body.error,
          "username and password must have at least 3 characters"
        );
      });

      test("if username is missing", async () => {
        const user = {
          name: "huuhaa",
          password: "kokeilu",
        };

        const result = await api
          .post("/api/users")
          .send(user)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        assert.strictEqual(
          result.body.error,
          "username and password are required"
        );
      });

      test("if password is missing", async () => {
        const user = {
          username: "huuhaa",
          name: "kokeilu",
        };

        const result = await api
          .post("/api/users")
          .send(user)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        assert.strictEqual(
          result.body.error,
          "username and password are required"
        );
      });
    });
  });
});

after(async () => await mongoose.connection.close());
