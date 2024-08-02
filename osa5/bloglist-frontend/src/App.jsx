import { useState, useEffect, useRef } from "react";

import loginService from "./services/login";
import blogService from "./services/blogs";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const [notification, setNotification] = useState(null);

  const blogFormRef = useRef();

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  useEffect(() => {
    const resetNotificationTimer = setTimeout(
      () => setNotification(null),
      5000
    );

    return () => clearTimeout(resetNotificationTimer);
  }, [notification]);

  useEffect(() => {
    const persistedUserJson = window.localStorage.getItem("user");
    if (persistedUserJson) {
      const persistedUser = JSON.parse(persistedUserJson);

      setUser(persistedUser);
      blogService.setToken(persistedUser.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("user", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
    } catch (_) {
      setNotification({
        message: "Wrong username or password",
        isError: true,
      });
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const addBlog = async (blog) => {
    blogFormRef.current.toggleVisibility();

    try {
      const newBlog = await blogService.create(blog);

      setBlogs(blogs.concat(newBlog));

      setNotification({
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        isError: false,
      });
    } catch (error) {
      setNotification({
        message: `Failed to add blog. Error: ${error.message}`,
        isError: true,
      });
    }
  };

  const updateLikes = async (id) => {
    const blog = blogs.find((blog) => blog.id === id);

    try {
      const returnedBlog = await blogService.update(id, {
        likes: blog.likes + 1,
      });

      if (returnedBlog) {
        setBlogs(
          blogs.map((blog) =>
            blog.id === id ? { ...blog, likes: returnedBlog.likes } : blog
          )
        );
      }
    } catch (error) {
      setNotification({
        message: `Failed to update likes for blog '${blog.title}'. Error: ${error.message}`,
        isError: true,
      });
    }
  };

  const removeBlog = async (id) => {
    const blog = blogs.find((blog) => blog.id === id);

    const shouldRemoveBlog = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    );

    if (shouldRemoveBlog) {
      setBlogs(blogs.filter((blog) => blog.id !== id));

      try {
        await blogService.remove(id);

        setNotification({
          message: `Blog '${blog.title}' removed successfully.`,
          isError: false,
        });
      } catch (error) {
        setBlogs(blogs);

        setNotification({
          message: `Failed to remove blog '${blog.title}'. Error: ${error.message}`,
          isError: true,
        });
      }
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification value={notification} />

      {user ? (
        <>
          <h3>{user.username} logged in </h3>
          <button onClick={handleLogout}>logout</button>

          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm onCreate={addBlog} />
          </Togglable>

          {sortedBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              username={user.username}
              onLike={() => updateLikes(blog.id)}
              onDelete={() => removeBlog(blog.id)}
            />
          ))}
        </>
      ) : (
        <>
          <h2>Log in to application</h2>
          <LoginForm onLogin={handleLogin} />
        </>
      )}
    </div>
  );
};

export default App;
