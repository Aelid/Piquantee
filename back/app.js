const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

// securité
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Routes
const sauceRoutes = require("./routes/sauceRoutes");
const userRoutes = require("./routes/userRoutes");

// demarre Express app
const app = express();

// connection MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Helmet middlware pour headers
app.use(helmet());

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 100,
});
app.use(limiter); // limitation des requête

// config CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Content-Type, Access-Control-Allow-Headers"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Parsing req
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Securité
app.use(mongoSanitize()); // Mongo sanitize to sanitizes inputs against query selector injection attacks
app.use(morgan("combined")); // Morgan middleware to create logs
app.use(hpp()); // HPP middleware to protect against HTTP parameter pollution attacks

// config routes
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;