const express = require("express");
const router = express.Router();
let path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/get-pic-profil/:name", function (req, res, next) {
  let options = {
    root: path.join("../public/uploads"),
    dotfiles: "deny",
    headers: {
      "x.timestamp": Date.now(),
      "x-sent": true,
    },
  };
  let fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      console.log("sent:", fileName);
    }
  });
});

module.exports = router;
