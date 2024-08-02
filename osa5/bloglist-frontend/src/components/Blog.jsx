import React, { useState } from "react";

const style = {
  paddingTop: 10,
  paddingLeft: 2,
  border: "solid",
  borderWidth: 1,
  marginBottom: 5,
};

const Blog = ({ blog, username, onLike, onDelete }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div style={style} data-testid="blog-entry">
      <span>
        {blog.title} {blog.author}
      </span>
      <button
        onClick={() => setVisible(!visible)}
        data-testid="toggle-visibility-button"
      >
        {visible ? "hide" : "view"}
      </button>
      {visible && (
        <div data-testid="blog-details">
          <span>{blog.url}</span>
          <div>
            <span>likes {blog.likes} </span>
            <button onClick={() => onLike()} data-testid="like-button">
              like
            </button>
          </div>
          <span>{blog.user.username}</span>
          {username === blog.user.username && (
            <div>
              <button onClick={() => onDelete()} data-testid="delete-button">
                remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
