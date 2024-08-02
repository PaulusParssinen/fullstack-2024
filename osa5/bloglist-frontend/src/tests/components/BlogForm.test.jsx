import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "../../components/BlogForm";
import { vi, expect } from "vitest";

test("BlogForm calls onCreate", async () => {
  const onCreateMock = vi.fn();
  const user = userEvent.setup();

  const blog = {
    title: "Test blog",
    author: "Test author",
    url: "Test url",
  };

  render(<BlogForm onCreate={onCreateMock} />);

  const title = screen.getByTestId("title-input");
  const author = screen.getByTestId("author-input");
  const url = screen.getByTestId("url-input");
  const createButton = screen.getByTestId("create-button");

  await user.type(title, blog.title);
  await user.type(author, blog.author);
  await user.type(url, blog.url);
  await user.click(createButton);

  expect(onCreateMock.mock.calls).toHaveLength(1);
  expect(onCreateMock.mock.calls[0][0]).toEqual(blog);
});
