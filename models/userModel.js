const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  age: Number,
  favoriteChar: String,
  description: String,
 


  
 pictureUrl:[String,],
  
  
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
