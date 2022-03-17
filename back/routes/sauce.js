const express = require("express");
const router = express.Router();

// Middlewares imports
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Controllers imports
const sauceCtrl = require("../controllers/sauce");

// Routes pour les sauces
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, sauceCtrl.likeOrDislike);
router.post("/:id/dislike", auth, sauceCtrl.likeOrDislike);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);

module.exports = router;
