const { validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");

module.exports = {
  // GET request functions
  async getComments(req, res, next) {
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: Number(req.params.postId),
        },
      });

      // If no post, no comments can exist
      if (!post) {
        return res.status(404).json({
          error: { code: "NOT_FOUND", message: "Resource not found" },
        });
      }

      const comments = await prisma.comment.findMany({
        where: { postId: Number(req.params.postId) },
      });

      return res.status(200).json({ data: { comments } });
    } catch (error) {
      return next(error);
    }
  },

  // POST request functions
  async postComment(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { errors: errors.array() } });
    }

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: Number(req.params.postId),
        },
      });

      // If no post exists, no comments can be added to it
      if (!post) {
        return res.status(404).json({
          error: { code: "NOT_FOUND", message: "Resource not found" },
        });
      }

      await prisma.comment.create({
        data: {
          message: req.body.commentMessage,
          authorId: req.user.id,
          postId: post.id,
        },
      });

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
