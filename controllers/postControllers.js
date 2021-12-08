const PostModel = require("../models/postModel");

function handleServerError(err, res) {
  console.log("Une erreur est survenue", err);
  return res.sendStatus(500);
}

const post = {
  /*  makePost(req, res, next) {
    let { theKey } = req.body;
    console.log("this is a log of theKey key", theKey);
    return PostModel.create({
      
    })
  }, */

  createPost(req, res, next) {
    let { title, content } = req.body;
    if ((!title, !content)) {
      return res.status(400).send({ error: "Bad Request" });
    }

    return PostModel.create({
      title: title,
      content: content,
      date: Date.now(),
      author: req.user.userName,
    })
      .then(() => {
        res.status(200).send({success:true});
      })
      .catch((err) => handleServerError(err, res));
  },

  showAllPosts(req, res, next) {
    PostModel.find({})
      .then((postListing) => {
        res.send(postListing);
      })
      .catch((err) => handleServerError(err, res));
  },
};

module.exports = post;
