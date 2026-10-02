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
      const post = await prisma.post.findUniqueOrThrow({
        where: { id: Number(req.params.postId), isPublished: true },
      });

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

  // PUT request functions
  async putPost(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: { errors: errors.array() },
      });
    }

    try {
      const user = req.user;

      await prisma.post.update({
        where: { id: Number(req.params.postId), authorId: user.id },
        data: {
          header: req.body.postHeader,
          subHeader: req.body.postSubHeader,
          body: req.body.postBody,
        },
      });

      return res
        .status(200)
        .json({ data: { message: "Post updated successfully." } });
    } catch (error) {
      return next(error);
    }
  },

  // DELETE request functions
  async deletePost(req, res, next) {
    try {
      await prisma.post.delete({
        where: { id: Number(req.params.postId) },
      });

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
