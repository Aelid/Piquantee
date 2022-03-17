const express = require("express");
const router = express.Router();

// on importe les controllers
const userCtrl = require("../controllers/user");

// routes pour les utilisateurs
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
