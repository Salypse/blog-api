const { body, validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");

module.exports = {
  validateSignUp: [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required.")
      .bail()

      // Check if username has been used
      .custom(async (value) => {
        const user = await prisma.user.findUnique({
          where: {
            username: value,
          },
        });

        if (user) {
          throw new Error("Username is not available.");
        }
      }),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email address is required.")
      .bail()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .bail()
      .normalizeEmail()

      // Check if email has been registered
      .custom(async (value) => {
        const user = await prisma.user.findUnique({ where: { email: value } });

        if (user) {
          throw new Error("Email is already registered.");
        }
      }),
    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .bail()
      .isLength({ min: 8 })
      .withMessage("Password must be at minimum 8 characters."),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm Password is required.")
      .bail()
      // Only compare passwords once the password meets the requirements.
      .if((value, { req }) => req.body?.password?.length >= 8)
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      }),
  ],

  validateLogin: [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .bail()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .bail()
      .normalizeEmail(),
    body("password").trim().notEmpty().withMessage("Password is required."),
  ],

  validateLoginForm(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { errors: errors.array() } });
    }

    next();
  },
};
