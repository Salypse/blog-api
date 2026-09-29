module.exports = {
  indexGet(req, res, next) {
    return res.json({
      data: {
        message: "Hello, World!",
      },
    });
  },
};
