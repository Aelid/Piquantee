// importation des package
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// Importation des  routes
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect("mongodb+srv://Aelid:YYOP9fTBNdZbk7HV@cluster0.hlnns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to MongoDB ! ✅ 🍀"))
  .catch(() => console.log("Oh Nooo ! Connection to MongoDB failed ! ❌ 🍀"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
