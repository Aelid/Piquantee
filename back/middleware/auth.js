const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      // on verifie l'autorisation 
      throw "Merci de vous connecter";
    }

    const token = req.headers.authorization.split(" ")[1]; // on trouve la partie du token authorization headers
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN); // on regarde si ça correspond a la secret token key
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "userId non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error || "Requête non authentifiée !" });
  }
};