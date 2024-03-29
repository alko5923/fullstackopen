const mongoose = require("mongoose"); // Remember to import mongoose
const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogRouter.get("/fetchByIds", async (request, response) => {
  // assume that the array of ids comes in a query parameter named 'ids'
  // and that it's a string of comma-separated values
  if (!request.query.ids) {
    return response
      .status(400)
      .json({ error: "'ids' query parameter is required" });
  }
  let ids = request.query.ids.split(",");
  console.log("Ids = ", ids);

  // convert the id strings to MongoDB ObjectId
  ids = ids.map((id) => mongoose.Types.ObjectId(id));

  const blogs = await Blog.find({
    _id: { $in: ids },
  }).populate("userId", { username: 1, name: 1 });

  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("userId", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  console.log("Request in blogRouter.post: ", request.body);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    userId: user._id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  console.log("Authorization", authorization);
  if (authorization) {
    return authorization;
  }
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

const tokenExtractor = (request) => {
  const token = getTokenFrom(request);
  console.log();
  return token;
};
blogRouter.delete("/:id", async (request, response) => {
  const requestToken = request.token
    ? request.token
    : tokenExtractor(request, response);
  console.log("Request token = ", requestToken);
  const blog = await Blog.findById(request.params.id);
  console.log("Blog = ", blog);
  const blogCreator = blog.userId;

  const decodedToken = jwt.decode(requestToken);
  const userIdFromDecodedToken = decodedToken.id;

  if (blogCreator.toHexString() === userIdFromDecodedToken.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    // Remove the blog reference from the user's blogs array
    // Do not forget to await here!
    let user = await User.findById(blogCreator.toHexString());
    let userBlogs = user.blogs;
    let blogToRemoveIdx = userBlogs.indexOf(request.params.id);
    userBlogs.splice(blogToRemoveIdx, 1);
    await User.updateOne({ name: user.name }, { blogs: userBlogs });
    response.status(204).end();
  } else {
    response.status(401).end();
  }
});

blogRouter.put("/:id", async (request, response) => {
  console.log("Request in blogRouter.put: ", request.body);
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  let user = await User.findById(updatedBlog.userId);
  updatedBlog.userId = user;
  response.json(updatedBlog);
});

module.exports = blogRouter;
