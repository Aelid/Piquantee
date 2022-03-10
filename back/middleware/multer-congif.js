const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  // Creation configuration objet pour multer
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(".")[0].split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension); // Creation de nom pour l'image
  },
});

const fileFilter = (req, file, callback) => {
  const extension = MIME_TYPES[file.mimetype]; // trouve le fichier upload
  if (extension === "jpg" || extension === "png") {
    callback(null, true); // verifie si c'est le bon format
  } else {
    callback("Erreur : Mauvais type de fichier", false);
  }
};

module.exports = multer({
  storage, // on add le multer a l'objet
  limits: { fileSize: 104857600 }, // on met le poids max a 100 Mo
  fileFilter, // on applique l'extention filter
}).single("image"); // on verifie qu'il n'y à qu'une image