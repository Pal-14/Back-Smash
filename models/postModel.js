const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: { type: String, default: "Titre de PA le Bg" },
  content: String,
  author: String,
  date: String,
  likes: [{}],
});

const PostModel = mongoose.model("post", PostSchema);

module.exports = PostModel;
