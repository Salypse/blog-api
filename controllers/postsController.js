const { validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");

module.exports = {
  // GET request functions
  async getPublishedPosts(req, res, next) {
    try {
      const posts = await prisma.post.findMany({
        where: { isPublished: true },
      });

      return res.status(200).json({ data: { posts } });
    } catch (error) {
      return next(error);
    }
  },

  async getPublishedPost(req, res, next) {
    try {
      const post = await prisma.post.findUnique({
        where: { id: Number(req.params.id), isPublished: true },
      });

      if (!post) {
        return res.status(404).json({
          error: { code: "NOT_FOUND", message: "Resource not found." },
        });
      }

      return res.status(200).json({ data: { post } });
    } catch (error) {
      return next(error);
    }
  },

  // POST Request functions
  async postNewPost(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: { errors: errors.array() },
      });
    }

    try {
      const user = req.user;

      const post = await prisma.post.create({
        data: {
          header: req.body.postHeader,
          subHeader: req.body.postSubHeader,
          body: req.body.postBody,
          authorId: user.id,
        },
      });

      return res.status(201).json({
        data: { message: "Successfully created new post.", post },
      });
    } catch (error) {
      return next(error);
    }
  },
};
