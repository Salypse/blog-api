require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const bcrypt = require("bcryptjs");

const { prisma } = require("../lib/prisma");

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: username,
          },
        });

        // Check if user exists
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // Check is password matches
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Jwt Strategy
const options = {
  secretOrKey: process.env.JWT_ACCESS_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    const user = await prisma.user.findUnique({
      where: {
        id: jwt_payload.userId,
      },
    });

    if (!user) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  }),
);

module.exports = passport;
