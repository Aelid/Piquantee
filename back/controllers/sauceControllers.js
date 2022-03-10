const Sauce = require("../models/SauceSchema");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const regex = /^[a-zA-Z0-9 _.,!()&]+$/;

// création Sauce
exports.addSauce = (req, res, next) => {
  const newSauce = JSON.parse(req.body.sauce);
  delete newSauce._id;
  if (
    !regex.test(newSauce.name) ||
    !regex.test(newSauce.manufacturer) ||
    !regex.test(newSauce.description) ||
    !regex.test(newSauce.mainPepper) ||
    !regex.test(newSauce.heat)
  ) {
    return res
      .status(500)
      .json({ error: "Des champs contiennent des caractères invalides" }); // on Check les input values format avant de les gérer
  }
  const sauce = new Sauce({
    ...newSauce,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  }); // Creation de nouvelle sauce en accord avec le schema,et on le save dans DB
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// LIKE ou DISLIKE Sauce
exports.giveOpinion = (req, res, next) => {
  // Utilisateur like la Sauce
  // on push l'user id dans les utilisateur qui like dans l'array et on augmente les likes de 1
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Un like de plus !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  // si l'user dislike la Sauce
  // on push l'user id dans les utilisateur qui dislike dans l'array et on diminue les likes de 1
  else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then((sauce) =>
        res.status(200).json({ message: "Un dislike de plus !" })
      )
      .catch((error) => res.status(400).json({ error }));
  }

  // si l'user efface son opinion
  // ça depend si il a like ou dislike la sauce avant d'annuler son opinion :
  // on cherche et on trouve l'user id dans les utilisateur qui like ou dislike dans l'array
  // on descend les likes or dislikes un par un
  else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Un like de moins !" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Un dislike de moins !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

// MAJ Sauce
exports.modifySauce = (req, res, next) => {
  // on cherche si l'image a été modifié
  // si oui, on inject req.body.sauce + new image dans DB
  // si non,on inject toute les value de req.body in DB

  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        userId: req.body.userId,
      };

  if (
    !regex.test(sauceObject.name) ||
    !regex.test(sauceObject.manufacturer) ||
    !regex.test(sauceObject.description) ||
    !regex.test(sauceObject.mainPepper) ||
    !regex.test(sauceObject.heat)
  ) {
    return res
      .status(500)
      .json({ error: "Des champs contiennent des caractères invalides" }); //on verifie les format des resultat avant de les gérer
  }

  Sauce.updateOne(
    { _id: req.params.id },
    {
      ...sauceObject,
      _id: req.params.id,
    }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// efface Sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; // Finding the image's name
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) // Deleting the image in DB after deleting it from disk
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// avoir toute les Sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// avoir une  Sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};