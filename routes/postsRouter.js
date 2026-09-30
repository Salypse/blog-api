const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/postsController");
const { optionalAuth, requiredAuth } = require("../middleware/auth");

const postValidator = require("../validators/postValidator");

// GET
postsRouter.get("/", optionalAuth, postsController.getPublishedPosts);
postsRouter.get("/:id", optionalAuth, postsController.getPublishedPost);

// POST
postsRouter.post(
  "/",
  requiredAuth,
  postValidator.validatePost,
  postsController.postNewPost,
);

module.exports = postsRouter;
