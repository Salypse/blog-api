require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prisma.js");

module.exports = {
  login(req, res, next) {
    const user = req.user;

    // Generate access and refresh tokens
    try {
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" },
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
      );

      // Set HTTP cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day lifetime
        path: "/auth/refresh",
      });

      return res.json({
        data: {
          accessToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async signUp(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: { errors: errors.array() },
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create user in db
      const user = await prisma.user.create({
        data: {
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        },
      });

      return res.status(201).json({
        data: {
          message: "Account created successfully",
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async refreshToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken;

    // If no refresh token deny access
    if (!refreshToken) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Unauthorized access." },
      });
    }

    // Check validity of refreshToken
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, token) => {
      if (err)
        return res.status(401).json({
          error: { code: "UNAUTHORIZED", message: "Unauthorized access." },
        });

      //Create and return new access token
      const accessToken = jwt.sign(
        { userId: token.userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" },
      );

      return res.json({ data: { accessToken } });
    });
  },
};
