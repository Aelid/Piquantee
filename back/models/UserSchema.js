const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// création Schema
const userSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
    unique: true, // utilisation mongoose-unique-validator pour empecher la création de deux compte sur le même mail
  },
  password: {
    type: String,
    required: true,
  },
});

// applique mongoose-unique-validator sur le schéma
userSchema.plugin(uniqueValidator);

// exportation User Schema
module.exports = mongoose.model("User", userSchema);