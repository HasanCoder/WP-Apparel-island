var Department = require("../models/Department.js");
var auth = require("../middleware/AuthMiddleware.js");
var express = require("express");

const router = express.Router();

router.post("/new", (req, res) => {
  const payload = req.body;

  Department.create(payload, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

router.get("/sync", (req, res) => {
  Department.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  Department.deleteOne({ _id: id }, {}, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("success");
    }
  });
});

router.post("/update/:id", (req, res) => {
  const id = req.params.id;
  Department.updateOne({ _id: id }, req.body, {}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get("/find/:id", (req, res) => {
  const id = req.params.id;
  Department.findById(id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

module.exports = router;
