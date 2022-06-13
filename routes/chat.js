var Chat = require('../models/Chat.js');
var auth = require('../middleware/AuthMiddleware.js');
var express = require('express');
var multer = require('multer');


const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function (req, file, cb){
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf'){
    cb(null, true);
  }else{
    cb(null,false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter:fileFilter
});


const router = express.Router();

router.post('/new' , upload.array('files',10) , (req,res,next) => {
    let message;
    let images = [];
    
    if(req.files){

      for(var i=0;i<req.files.length;i++){
        images.push(req.files[i].path);
      }

    }
    message = { ...req.body , images:images };

    Chat.create(message , (err,data) => {
        if(err) {
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    });

});



router.get('/sync/:order' , (req,res) => {
    const order = req.params.order;
    Chat.find({order:order}).sort({time: 'desc'}).exec((err,data) => {
      if(err){
          res.status(500).send(err);
      }else{
          res.status(200).send(data);
      }
    })
});

module.exports = router;
