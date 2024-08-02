import { useState } from "react";

const BlogForm = ({ onCreate }) => {
  const [blog, setBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleCreate = async (e) => {
    e.preventDefault();

    await onCreate(blog);

    setBlog({
      title: "",
      author: "",
      url: "",
    });
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            type="text"
            value={blog.title}
            name="title"
            placeholder="Blog title"
            data-testid="title-input"
            onChange={({ target }) => setBlog({ ...blog, title: target.value })}
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            type="text"
            value={blog.author}
            name="author"
            placeholder="Blog author"
            data-testid="author-input"
            onChange={({ target }) =>
              setBlog({ ...blog, author: target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            type="url"
            value={blog.url}
            name="url"
            placeholder="Blog URL"
            data-testid="url-input"
            onChange={({ target }) => setBlog({ ...blog, url: target.value })}
          />
        </div>
        <button type="submit" data-testid="create-button">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
