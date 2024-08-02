import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Blog from "../../components/Blog";
import userEvent from "@testing-library/user-event";
import { vi, expect } from "vitest";

const blog = {
  title: "Title",
  author: "Author",
  url: "https://www.example.com",
  likes: 1337,
  user: {
    name: "Huu haa",
    username: "huuhaa",
  },
};

test("renders only title and author by default", () => {
  const { container } = render(
    <Blog
      blog={blog}
      username="huuhaa"
      handleDelete={() => {}}
      handleLike={() => {}}
    />
  );

  const detail = container.querySelector('[data-testid="blog-details"]');
  expect(screen.getByText("Title Author")).toBeDefined();
  expect(detail).toBeNull();
});

test("details are shown after clicking show button", async () => {
  const user = userEvent.setup();

  render(
    <Blog
      blog={blog}
      username="huuhaa"
      handleDelete={() => {}}
      handleLike={() => {}}
    />
  );

  const showButton = screen.getByText("view");

  await user.click(showButton);

  expect(screen.getByText("https://www.example.com")).toBeDefined();
  expect(screen.getByText("likes 1337")).toBeDefined();
  expect(screen.getByText("huuhaa")).toBeDefined();
});

test("onLike is called twice when like button is clicked twice", async () => {
  const onLikeMock = vi.fn();
  const user = userEvent.setup();

  render(
    <Blog
      blog={blog}
      username="huuhaa"
      onDelete={() => {}}
      onLike={onLikeMock}
    />
  );

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const likeButton = screen.getByTestId("like-button");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(onLikeMock.mock.calls).toHaveLength(2);
});
