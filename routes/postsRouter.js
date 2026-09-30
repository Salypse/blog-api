const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/postsController");
const { optionalAuth } = require("../middleware/auth");

postsRouter.get("/", optionalAuth, postsController.getPublishedPosts);
postsRouter.get("/:id", optionalAuth, postsController.getPublishedPost);

module.exports = postsRouter;
