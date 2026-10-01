const { validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");

module.exports = {
  // GET request functions
  async getComments(req, res, next) {
    try {
      const post = await prisma.post.findUniqueOrThrow({
        where: {
          id: Number(req.params.postId),
          isPublished: true,
        },
      });

      const comments = await prisma.comment.findMany({
        where: { postId: post.id },
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
      const post = await prisma.post.findUniqueOrThrow({
        where: {
          id: Number(req.params.postId),
          isPublished: true,
        },
      });

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

  // PUT request functions
  async putComment(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { errors: errors.array() } });
    }

    try {
      const post = await prisma.post.findUniqueOrThrow({
        where: {
          id: Number(req.params.postId),
          isPublished: true,
        },
      });

      await prisma.comment.update({
        where: {
          id: Number(req.params.commentId),
          authorId: req.user.id,
          postId: post.id,
        },
        data: { message: req.body.commentMessage },
      });

      return res
        .status(200)
        .json({ data: { message: "Comment updated successfully" } });
    } catch (error) {
      return next(error);
    }
  },
};
