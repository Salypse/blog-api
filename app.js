require("dotenv").config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const routes = require("./routes/index");
const CustomError = require("./middleware/errorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/", routes.indexRouter);
app.use("/auth", routes.authRouter);
app.use("/posts", routes.postsRouter);
app.use("/posts/:postId/comments", routes.commentsRouter);

// Resource not found error
app.use((req, res) => {
  return res
    .status(404)
    .json({ error: { code: "NOT_FOUND", message: "Resource not found." } });
});

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message },
    });
  } else {
    // Prisma not found error
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Resource not found." } });
    }

    console.error(err);
    return res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Something went wrong." },
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on Port: ${PORT}`);
});
