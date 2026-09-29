const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");

const passport = require("../config/passport");

authRouter.post(
  "/login",
  authValidator.validateLogin,
  authValidator.validateLoginForm,
  (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      // Handle authentication errors
      if (err) {
        return next(err);
      }

      // Return authentication failure
      if (!user) {
        return res.status(401).json({
          error: {
            code: "UNAUTHORIZED",
            message: info.message,
          },
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  authController.login,
);

authRouter.post(
  "/sign-up",
  authValidator.validateSignUp,
  authController.signUp,
);

authRouter.post("/refresh", authController.refreshToken);

module.exports = authRouter;
