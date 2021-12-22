const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: { type: String, default: "Titre de PA le Bg" },
  content: String,
  author: String,
  authorProfilePicture: String,
  date: String,
  time: String,
  between: Number,
  likes: [{}],
  comments: [{}]
});

const PostModel = mongoose.model("post", PostSchema);

module.exports = PostModel;
