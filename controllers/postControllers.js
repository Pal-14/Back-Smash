const { response } = require("express");
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
    // Const pour avoir la date au format JJ/MM/AAAA + Heures/Minutes/Secondes
    // la ('0' + d.getminutes()).slice(-2); c'est pour avoir Exemple 11:02:34 et non pas 11:2:34
    //cela récupère les dizaines même si c'est un 0.
    const d = new Date();
    const date =
      ("0" + d.getDate()).slice(-2) +
      " /" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      " /" +
      d.getFullYear() +
      " " +
      "à" +
      ":" +
      d.getHours() +
      ":" +
      ("0" + d.getMinutes()).slice(-2) +
      ":" +
      ("0" + d.getSeconds()).slice(-2);
    console.log(date);

    // Const pour avoir seulement le format Heures/Minutes/Secondes
    const t = new Date();
    const time = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
    console.log(time);

    function daysOrHoursBetweenPosts(firstDate, secondDate) {
      return (secondDate - firstDate) / (1000 * 3600 * 24);
    }

    const nbOfDaysOrHours = daysOrHoursBetweenPosts(
      new Date(Date.now()),
      new Date(date)
    );
    console.log(typeof nbOfDaysOrHours);

    return PostModel.create({
      title: title,
      content: content,
      date: date,
      time: time,
      betwenn: nbOfDaysOrHours,
      author: req.user.userName,
    })
      .then(() => {
        res.status(200).send({ success: true, message: " Votre post à été créer" });
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

  findAPost(req, res, next) {
    let postId = req.params.id;
    PostModel.findOne({ _id: postId })
      .then((response) => {
        console.log(response, "res");
        if (!response) {
          return res
            .status(404)
            .send({ Success: false, message: "Aucun post correspondant" });
        }
        return res.send(response);
      })
      .catch((err) => handleServerError(err, res));
  },

  toggleLike(req, res, next) {
    console.log(req.body);
    let userId = req.body.user;
    let postId = req.body.post;

    PostModel.findOne({ _id: postId })
      .then((response) => {
        console.log(response);
        if (!response) {
          return res.status(404).send("Aucun post correspondant");
        }
        let likes = response.likes;
        let postHasUser = likes.includes(userId);
        if (!postHasUser) {
          PostModel.updateOne({ _id: postId }, { $push: { likes: userId } })
            .then((response2) => {
              console.log(response2);
              return res.send("Vous avez liké");
            })
            .catch((err) => handleServerError(err, res));
        } else {
          PostModel.updateOne({ _id: postId }, { $pull: { likes: userId } })
            .then((response3) => {
              console.log(response3);
              return res.send("Votre like à été supprimé");
            })
            .catch((err) => handleServerError(err, res));
        }
      })
      .catch((err) => handleServerError(err, res));
  },
};

module.exports = post;
