const { prisma } = require("../lib/prisma");

module.exports = {
  async getComments(req, res, next) {
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: Number(req.params.postId),
        },
      });

      // If no post, no comments can exist
      if (!post) {
        return res
          .status(404)
          .json({
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
};
