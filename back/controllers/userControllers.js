// Requires
const User = require("../models/UserSchema");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const mongoMask = require("mongo-mask");
const session = require("express-session");

// Creation d'une validation de schema pour mdp
var schema = new passwordValidator();
schema
  .is()
  .min(6)
  .is()
  .max(20)
  .has()
  .not()
  .spaces()
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(1);

exports.signup = (req, res, next) => {
  if (!mailValidator.validate(req.body.email)) {
    throw {
      error: "L'adresse mail n'est pas valide !", // on verifie que ça soit un email
    };
  } else if (!schema.validate(req.body.password)) {
    throw {
      error: "Le mot pass n'est pas valide !", // on verifie que le mdp correspond au schéma
    };
  } else {
    bcrypt
      .hash(req.body.password, 10) // on Hash et salt le mot de passe
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        }); // crée un nouvel user
        user
          .save() // sauvegarde user dans DB
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(501).json({ error }));
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // on trouve l'utilisateur dans DB
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Aucun compte ne correspond à l'adresse email renseingée !", // on retourne une erreur si il est pas trouver dans DB
        });
      }
      bcrypt
        .compare(req.body.password, user.password) // Compare le mot de passe hashé et le mot de passe ranger
        .then((valide) => {
          if (!valide) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorrect !" }); // retourne une erreur si les mdp ne corresponde pas
          }

          const newToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_TOKEN,
            { expiresIn: "24h" }
          );

          res.status(200).json({ userId: user._id, token: newToken });
        })

        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};