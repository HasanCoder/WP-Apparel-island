var Forum = require('../models/Forum.js');
var auth = require('../middleware/AuthMiddleware.js');
var express = require('express');


const router = express.Router();


router.get('/find/:id' , (req,res) => {
    const id = req.params.id;
    Forum.findById(id, (err,data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data);
        }
    })
});

router.post('/new'  , (req,res) => {

    const payload = req.body;
    console.log('payload' , req.body);
    Forum.create(payload , (err,data) => {
        if(err) {
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
});

router.get('/sync' , (req,res) => {
    Forum.find((err,data) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    });
});

router.post('/update/:id' , (req,res) => {
    const id = req.params.id;
    Forum.findOneAndUpdate(id , req.body, (err,data) => {
      if(err){
        res.status(500).send(err);
      }else{
        res.status(200).send(data);
      }
    });
});

module.exports =  router;
