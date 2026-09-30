const { body } = require("express-validator");
const { prisma } = require("../lib/prisma");

module.exports = {
  validatePost: [
    body("postHeader")
      .trim()
      .notEmpty()
      .withMessage("Header is required.")
      .bail()
      .isLength({ min: 1, max: 255 })
      .withMessage("Header must be between 1 and 255 characters.")
      .bail(),
    body("postSubHeader")
      .trim()
      .isLength({ max: 255 })
      .withMessage("Sub header cannot be greater than 255 characters."),
    body("postBody").trim().notEmpty().withMessage("Body is required.").bail(),
  ],
};
