const { body } = require("express-validator");

module.exports = {
  validateComment: [
    body("commentMessage")
      .trim()
      .notEmpty()
      .withMessage("Comment is required."),
  ],
};
