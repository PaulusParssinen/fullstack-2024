const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const creatorUserId = request.user.id;

  const blog = new Blog({
    title,
    author,
    user: creatorUserId,
    url,
    likes,
  });
  const newBlog = await blog.save();

  const populatedBlog = await newBlog.populate("user", {
    username: 1,
    name: 1,
  });

  response.status(201).json(populatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: "token invalid" });
  }

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() != request.user.id) {
    return response.status(401).json({ error: "unauthorized user" });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      likes: request.body.likes,
    },
    { new: true }
  );
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
