let path = require("path");
const multer = require("multer");

const publicFolderStorage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function (req, file, cb) {
      let myFileName =
        file.fieldname +
        "$" +
        req.user._id +
        "$" +
        Date.now() +
        path.extname(file.originalname);
      if (!req.myArray) {
        req.myArray = [myFileName];
      } else {
        req.myArray.push(myFileName);
      }
      cb(null, myFileName);
    },
  });
  

function checkFileTypeForPics(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(null, false);
  }
}

const uploadToPublicFolder = multer({
  storage: publicFolderStorage,
  limit: { fileSize: 100000 },
  fileFilter: function (req, file, cb) {
    checkFileTypeForPics(file, cb);
  },
}).any("file:");

const UploadMidlleware = {
  uploadsPicsForProfile(req, res, next) {
    uploadToPublicFolder(req, res, next, (err) => {
      if (err) {
        return res.status(400).send({
          success: false,
          message: "Une erreur s'est produite (Erreur MUDP/P)",
        });
      }
      res.status(200).send({
        success: true,
        message: "Fichier Uploadé",
      });
      next();
    });
  },
};

module.exports = UploadMidlleware;
