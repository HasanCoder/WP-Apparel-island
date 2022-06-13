var User = require("../models/User.js");
var express = require("express");
var bcrypt = require("bcryptjs");
var config = require("config");
var jwt = require("jsonwebtoken");

const router = express.Router();

//Create User
router.post("/new", (req, res) => {
  const { name, email, password, department, isAdmin } = req.body;

  //validating fields
  if (!name || !email || !password || !department) {
    return res.status(400).json({ msg: "Invalid or missing data" });
  }

  //validating email
  // User.findOne({
  //   email: email,
  // }).then((user) => {
  //   if (user)
  //     return res
  //       .status(400)
  //       .json({ msg: "User already exists with this email" });
  //   else {
  const newUser = new User({
    name,
    email,
    password,
    department,
    isAdmin,
  });
  console.log("new user", newUser);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save().then((user) => {
        jwt.sign(
          { id: user.id },
          config.get("jwtSecret"),
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;

            res.json({
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                department: user.department,
                isAdmin: user.isAdmin,
              },
            });
          }
        );
      });
    });
  });
  //     }
  //   });
});

router.get("/sync", (req, res) => {
  User.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res
        .status(200)
        .send(data.filter((user) => `${user._id}` !== req.header("uid")));
    }
  });
});

router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  User.deleteOne({ _id: id }, {}, (err, data) => {
    if (err || req.header("uid") === id) {
      res.status(500).send(err);
    } else {
      res.status(200).send("success");
    }
  });
});

router.post("/update/:id", (req, res) => {
  const id = req.params.id;
  let request = req.body;
  if (request.password) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(request.password, salt, (err, hash) => {
        if (err) throw err;
        request.password = hash;
        User.updateOne({ _id: id }, req.body, {}, (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(data);
          }
        });
      });
    });
  } else {
    res.status(401).send();
  }
});

router.get("/find/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

module.exports = router;
