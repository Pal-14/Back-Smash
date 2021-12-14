const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALTS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

const UserModel = require("../models/userModel");
/* const { findOne } = require("../models/userModel"); */

function handleServerError(err, res) {
  console.log("Une erreur est survenue", err);
  return res.sendStatus(500);
}

function readToken(req) {
  let authorization = req.headers.authorization;
  if (!authorization) return nuul;
  let splitted = authorization.split(" ");
  let token = splitted[1];
  if (token) return token;
  else return null;
}

const UserController = {
  /*   logBody(req, res, next) {
    console.log(req.body);
    next();
  },

  isAdmin(req, res, next) {
    if (req.user.role === "admin") {
      return res.send(200);
    }
    return res.send(403);
  }, */

  //Public Routes

  signup(req, res, next) {
    let { userName, firstName, lastName, email, password, confirmPassword } =
      req.body;

    //verification que toutes les infos necessaires sont la
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).send({ error: "Bad request" });
    }

    //verification que password=confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).send({ error: "Passwords don't match" });
    }

    //verification qu'il n'y a pas le même mail, sinon 400 utilisateur/email deja existant
    return UserModel.findOne({ email: email })
      .then((alreadyExistingUser) => {
        //pas de user avec le même mail dans la DB, on peut le créer
        if (alreadyExistingUser === null) {
          let hashedPassword = bcrypt.hashSync(password, SALTS);

          //on creer l'utilisateur
          return UserModel.create({
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
          })
            .then((newlyCreatedUser) => {
              jwt.sign(
                { _id: newlyCreatedUser._id },
                JWT_SECRET,
                (err, token) => {
                  if (err) console.log(err);
                  console.log(token);
                  res.status(200).send({
                    token: token,
                    success: true,
                    message: "Votre Compte à été créer avec Succés",
                  });
                }
              );
            })
            .catch((err) => handleServerError(err, res));
        }
        return res.status(400).send({
          success: false,
          message: "Email exists already",
        });
      })
      .catch((err) => handleServerError(err, res));
  },

  login(req, res, next) {
    const userInfos = req.body;
    const email = userInfos.email;
    const password = userInfos.password;

    //si pas toutes les infos => renvoie 400
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Merci de remplir tout les champs",
      });
    }
    return UserModel.findOne({ email: email })
      .then((user) => {
        if (user === null) {
          return res
            .status(403)
            .send({ success: false, message: "Informations incorrectes" });
        }
        let passwordDoMatch = bcrypt.compareSync(password, user.password);
        if (!passwordDoMatch) {
          console.log(req);
          return res.status(401).send({
            success: false,
            message: "Informations de connexion Incorrectes",
          });
        }
        jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: "24h" },
          (err, token) => {
            if (err) console.log(err);
            res.status(200).send({
              token: token,
              success: true,
              message: "Connecté avec succés",
            });
          }
          );
        })

      .catch((err) => handleServerError(err, res));
  },

  completeUserListing(req, res, next) {
    UserModel.find({})
      .then((userListing) => {
        res.send(userListing);
      })
      .catch((err) => handleServerError(err, res));
  },

  getInfos(req, res, next) {
    return res
      .status(200)
      .send({ success: true, message: "Infos utilisateur", data: req.user });
  },

  stockUserDocument(req, res, next) {
    const myArray = req.myArray;
    console.log(req.myArray, "array");
    if (!myArray) {
      return res.status(400).send({
        success: false,
        message: "Champs néccessaires non renseignés",
      });
    }
    return UserModel.findOneAndUpdate(
      { user_id: req.user._id },
      {
        $push: {
          pictureUrl: myArray,
        },
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: "Votre photo à bien été enregistrée.",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: `Erreur : ${err}`,
        });
      });
  },

  editProfil(req, res, next) {
    let { userName, firstName, lastName, age, favoriteChar, description } =
      req.body;
    if (!description) {
      return res.status(400).send({
        success: false,
        message: "Vous devez mettre une description",
      });
    }
    return UserModel.updateOne(
      { _id: req.user._id },
      {
        $set: {
          userName,
          lastName,
          firstName,
          age,
          description,
          favoriteChar,
        },
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: "description mise à jour",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur ESMDEU01",
        });
      });
  },
};

module.exports = UserController;
