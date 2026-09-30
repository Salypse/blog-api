const express = require("express");
const commentsRouter = express.Router({ mergeParams: true });
const commentsController = require("../controllers/commentsController");
const { optionalAuth, requiredAuth } = require("../middleware/auth");
const commentsValidator = require("../validators/commentsValidator");

// GET
commentsRouter.get("/", optionalAuth, commentsController.getComments);

// POST
commentsRouter.post(
  "/",
  requiredAuth,
  commentsValidator.validateComment,
  commentsController.postComment,
);

module.exports = commentsRouter;
