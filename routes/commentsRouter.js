const express = require("express");
const commentsRouter = express.Router({ mergeParams: true });
const commentsController = require("../controllers/commentsController");
const { optionalAuth } = require("../middleware/auth");

commentsRouter.get("/", optionalAuth, commentsController.getComments);

module.exports = commentsRouter;
