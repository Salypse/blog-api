const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/postsController");

postsRouter.get("/", postsController.getPublishedPosts);
postsRouter.get("/:id", postsController.getPublishedPost);

module.exports = postsRouter;
