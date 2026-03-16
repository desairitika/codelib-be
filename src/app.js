const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");

const { notFound, handleServerError } = require("./utils/errorHandler");
const swaggerDoc = require("../swagger/_swagger.js");

const indexRoutes = require("./routes/indexRoutes");
const commonRoutes = require("./routes/commonRoutes.js");
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const problemsRoutes = require("./routes/problemsRoutes");
const solutionsRoutes = require("./routes/solutionsRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const supportRoutes = require("./routes/supportRoutes");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1); // Exit with failure status code
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled promise rejection:", reason);
  process.exit(1); // Exit with failure status code
});

// Middlewares - CORS and body parsing must come before routes
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, { explorer: true })
);

//Routes
app.use("/", indexRoutes);
app.use("/api/v1", commonRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/problems", problemsRoutes);
app.use('/api/v1/problems/:id/solutions', solutionsRoutes);
app.use("/api/v1/solutions", solutionsRoutes);
app.use("/api/v1/solutions/:id/comments", commentsRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/support", supportRoutes);

// catch 404 and forward to error handler - MUST be after all routes
app.use(notFound);
// error handler - MUST be last middleware
app.use(handleServerError);

module.exports = app;
