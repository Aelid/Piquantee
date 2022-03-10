const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userControllers");
const bouncer = require("express-bouncer")(30000, 60000, 3); // empêche l'utilisateur d'essayer de se co trop de fois avec le mauvais mdp
const { userValidationRules, validate } = require("../middleware/validator");

// config controllers
router.post("/signup", userValidationRules(), validate, userCtrl.signup);
router.post("/login", bouncer.block, userCtrl.login);

// exportation Router
module.exports = router;