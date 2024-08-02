const mongoose = require("mongoose");
const supertest = require("supertest");
const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

describe("with seeded blogs", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const testUser = await helper.createTestUser("blog_creator");

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog({ ...blog, user: testUser.id });
      await blogObject.save();
    }
  });

  describe("GET /api/blogs", () => {
    test("returns all initial blogs", async () => {
      const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test("returns blogs with id field", async () => {
      const response = await api.get("/api/blogs");

      assert.ok(response.body[0].id);
    });
  });

  describe("with valid token", () => {
    let blogCreatorToken;

    beforeEach(async () => {
      blogCreatorToken = await helper.getTokenForUser("blog_creator");
    });

    describe("POST /api/blogs", () => {
      test("adds a new blog and increases count", async () => {
        const newBlog = {
          title: "New blog",
          author: "Author",
          url: "http://example.com",
        };

        await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${blogCreatorToken}`)
          .send(newBlog)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const blogs = await Blog.countDocuments();
        assert.strictEqual(blogs, helper.initialBlogs.length + 1);
      });

      test("adds blog with correct content", async () => {
        const newBlog = {
          title: "New blog",
          author: "Author",
          url: "http://example.com",
        };

        await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${blogCreatorToken}`)
          .send(newBlog)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/blogs");
        const addedBlog = response.body.find(
          (blog) => blog.title === newBlog.title
        );

        assert.strictEqual(addedBlog.title, newBlog.title);
        assert.strictEqual(addedBlog.author, newBlog.author);
        assert.strictEqual(addedBlog.url, newBlog.url);
        assert.strictEqual(addedBlog.likes, 0);
      });

      test("sets likes to 0 if not specified", async () => {
        const newBlog = {
          title: "Blog",
          author: "Author",
          url: "http://example.com",
        };

        await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${blogCreatorToken}`)
          .send(newBlog)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/blogs");
        const addedBlog = response.body.find(
          (blog) => blog.title === newBlog.title
        );

        assert.strictEqual(addedBlog.likes, 0);
      });
    });

    describe("POST /api/blogs", () => {
      test("returns 400 if title is missing", async () => {
        const blog = { author: "Author", url: "http://example.com", likes: 0 };

        const result = await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${blogCreatorToken}`)
          .send(blog)
          .expect(400);

        assert.strictEqual(result.status, 400);
      });

      test("returns 400 if URL is missing", async () => {
        const blog = { title: "Blog", author: "Author", likes: 0 };

        const result = await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${blogCreatorToken}`)
          .send(blog)
          .expect(400);

        assert.strictEqual(result.status, 400);
      });
    });

    describe("DELETE /api/blogs", () => {
      test("deleting third blog decreases count", async () => {
        const response = await api.get("/api/blogs");
        const blogsBefore = response.body;

        await api
          .delete(`/api/blogs/${blogsBefore[2].id}`)
          .set("Authorization", `Bearer ${blogCreatorToken}`)
          .expect(204);

        const blogsAfter = await api.get("/api/blogs");
        assert.strictEqual(blogsAfter.body.length, blogsBefore.length - 1);
      });

      test("returns 400 for invalid id", async () => {
        const result = await api
          .delete("/api/blogs/invalidid")
          .set("Authorization", `Bearer ${blogCreatorToken}`)
          .expect(400);

        assert.strictEqual(result.status, 400);
      });
    });
  });

  describe("DELETE /api/blogs", () => {
    test("returns 401 if no token", async () => {
      const response = await api.get("/api/blogs");

      const result = await api
        .delete(`/api/blogs/${response.body[2].id}`)
        .expect(401);

      assert.strictEqual(result.status, 401);
    });
  });

  describe("PUT /api/blogs", () => {
    test("updates likes successfully", async () => {
      const response = await api.get("/api/blogs");
      const blogId = response.body[0].id;
      const updatedBlog = { likes: 25 };

      await api.put(`/api/blogs/${blogId}`).send(updatedBlog).expect(200);

      const updatedResponse = await api.get("/api/blogs");
      assert.strictEqual(updatedResponse.body[0].likes, updatedBlog.likes);
    });

    test("returns 400 for invalid id", async () => {
      const updatedBlog = { likes: 25 };

      const result = await api
        .put("/api/blogs/invalidid")
        .send(updatedBlog)
        .expect(400);

      assert.strictEqual(result.status, 400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
