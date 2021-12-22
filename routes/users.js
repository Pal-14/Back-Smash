const express = require("express");
const UserController = require("../controllers/userController");
const UploadMidlleware = require("../middlewares/uploads");

const Post = require('../controllers/postControllers');
const Auth = require("../middlewares/authentification");
const UserModel = require("../models/userModel");


var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/complete-listing", UserController.completeUserListing);

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/check-token", Auth.isUser, UserController.getInfos); 




router.get("/display-all-post", Post.showAllPosts);
router.post("/post-by-user", Auth.isUser, Post.createPost);
router.put("/like-post", Auth.isUser, Post.toggleLike);

router.put("/edit-user-description", Auth.isUser,UserController.editProfil)

router.post("/upload", Auth.isUser, UploadMidlleware.uploadsPicsForProfile, UploadMidlleware.stockUserDocument, UserController.updateProfilePicOfUserPosts );


module.exports = router;
