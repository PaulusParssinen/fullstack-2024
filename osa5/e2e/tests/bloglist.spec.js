const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

const testBlog = {
  title: "Performance Improvements in .NET 8",
  author: "Stephen Toub",
  url: "https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/",
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post(`/api/testing/reset`);
    await request.post(`/api/users`, {
      data: {
        name: "huuhaa",
        username: "huuhaa",
        password: "secret",
      },
    });

    await page.goto("");
  });

  test("login form is visible", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
    await expect(page.getByTestId("username-input")).toBeVisible();
    await expect(page.getByTestId("password-input")).toBeVisible();
    await expect(page.getByTestId("login-button")).toHaveText("login");
  });

  describe("login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, { username: "huuhaa", password: "secret" });

      await expect(page.getByText("huuhaa logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, { username: "huuhaa", password: "wrong" });

      const notification = page.getByTestId("notification");
      await expect(notification).toHaveText("Wrong username or password");
      await expect(notification).toHaveCSS("color", "rgb(255, 0, 0)");
    });

    describe("when logged in", () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, { username: "huuhaa", password: "secret" });
      });

      test("a blog can be created", async ({ page }) => {
        await createBlog(page, testBlog);

        const locator = page
          .getByTestId("blog-entry")
          .getByText(testBlog.title);
        await expect(locator).toBeVisible();
      });

      test("a blog can be liked", async ({ page }) => {
        await createBlog(page, testBlog);

        await page.getByTestId("toggle-visibility-button").click();
        await page.getByTestId("like-button").click();
        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("a blog can be deleted by the user who created it", async ({
        page,
      }) => {
        page.on("dialog", async (dialog) => await dialog.accept());

        await createBlog(page, testBlog);

        await page.getByTestId("toggle-visibility-button").click();
        await page.getByTestId("delete-button").click();

        const notification = page.getByTestId("notification");
        expect(notification).toHaveText(
          `Blog '${testBlog.title}' removed successfully.`
        );
        expect(notification).toHaveCSS("color", "rgb(0, 128, 0)");
      });

      test("a blog cannot be deleted by other users", async ({
        page,
        request,
      }) => {
        await createBlog(page, testBlog);

        await page.getByText("logout").click();

        await request.post(`/api/users`, {
          data: {
            name: "Java Enjoyer",
            username: "javafan",
            password: "secret",
          },
        });

        await loginWith(page, { username: "javafan", password: "secret" });

        const entry = page
          .getByTestId("blog-entry")
          .filter({ hasText: testBlog.title });

        await entry.getByTestId("toggle-visibility-button").click();

        const details = entry.getByTestId("blog-details");

        await expect(details).toBeVisible();
        await expect(details).not.toContainText("remove");
      });

      test("Blogs are ordered by likes", async ({ page }) => {
        const interpreterBlog = {
          title: "Crafting Interpreters",
          author: "Bob Nystrom",
          url: "https://craftinginterpreters.com/",
        };

        await createBlog(page, interpreterBlog);
        await createBlog(page, testBlog);

        const interpEntry = page
          .getByTestId("blog-entry")
          .filter({ hasText: interpreterBlog.title });

        const testBlogEntry = page
          .getByTestId("blog-entry")
          .filter({ hasText: testBlog.title });

        await interpEntry.getByTestId("toggle-visibility-button").click();
        await testBlogEntry.getByTestId("toggle-visibility-button").click();

        await expect(interpEntry).toContainText("likes 0");
        await expect(testBlogEntry).toContainText("likes 0");

        await interpEntry.getByTestId("like-button").click();

        await testBlogEntry.getByTestId("like-button").click();
        await testBlogEntry.getByTestId("like-button").click();
        await testBlogEntry.getByTestId("like-button").click();

        await page.reload();

        const blogs = page.locator("[data-testid=blog-entry]");
        await expect(blogs.nth(0)).toContainText(testBlog.title);
        await expect(blogs.nth(1)).toContainText(interpreterBlog.title);
      });
    });
  });
});
