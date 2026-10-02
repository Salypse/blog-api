const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/postsController");
const { optionalAuth, requiredAuth, isAdmin } = require("../middleware/auth");

const postValidator = require("../validators/postValidator");

// GET
postsRouter.get("/", optionalAuth, postsController.getPublishedPosts);
postsRouter.get("/:postId", optionalAuth, postsController.getPublishedPost);

// POST
postsRouter.post(
  "/",
  requiredAuth,
  isAdmin,
  postValidator.validatePost,
  postsController.postNewPost,
);

// PUT
postsRouter.put(
  "/:postId",
  requiredAuth,
  isAdmin,
  postValidator.validatePost,
  postsController.putPost,
);

// DELETE
postsRouter.delete(
  "/:postId",
  requiredAuth,
  isAdmin,
  postsController.deletePost,
);
module.exports = postsRouter;
