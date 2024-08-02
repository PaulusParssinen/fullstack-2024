const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const testHelper = require("./test_helper");

const blogs = testHelper.initialBlogs;

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("of list consisting of one blog is correct", () => {
    const result = listHelper.totalLikes(blogs.slice(0, 1));
    assert.strictEqual(result, 7);
  });

  test("of the entire list is correct", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });
});

test("favorite blog is the one most likes", () => {
  const result = listHelper.favoriteBlog(blogs);

  assert.deepStrictEqual(result, blogs[2]);
});

test("author with most blogs is correct", () => {
  const result = listHelper.mostBlogs(blogs);

  assert.equal(result.author, "Robert C. Martin");
  assert.strictEqual(result.blogs, 3);
});

test("author with most likes is correct", () => {
  const result = listHelper.mostLikes(blogs);

  assert.equal(result.author, "Edsger W. Dijkstra");
  assert.strictEqual(result.likes, 17);
});
