const passport = require("../config/passport");

module.exports = {
  optionalAuth(req, res, next) {
    const bearerHeader = req.headers.authorization;

    // If bearer header validate token
    if (bearerHeader) {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
          return next(err);
        }

        if (info) {
          // If user has expired token return refresh status
          if (info.name === "TokenExpiredError") {
            return res.status(401).json({
              error: { code: "TOKEN_EXPIRED", message: "Token expired." },
            });
          }

          // If logged in user has invalid token return unauthorized status
          if (info.name === "JsonWebTokenError") {
            return res.status(401).json({
              error: { code: "UNAUTHORIZED", message: "Unauthorized access" },
            });
          }
        }

        if (!user) {
          return next();
        }

        req.user = user;
        return next();
      })(req, res, next);
    } else {
      return next();
    }
  },

  requiredAuth(req, res, next) {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      // If user has expired token return refresh status
      if (info?.name === "TokenExpiredError") {
        return res.status(401).json({
          error: { code: "TOKEN_EXPIRED", message: "Token expired." },
        });
      }

      if (!user) {
        return res.status(401).json({
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized access.",
          },
        });
      }

      req.user = user;
      return next();
    })(req, res, next);
  },

  isAdmin(req, res, next) {
    const user = req.user;

    if (!user.isAdmin) {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Admin access required." },
      });
    }

    next();
  },
};
