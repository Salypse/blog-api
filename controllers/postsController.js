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
};
