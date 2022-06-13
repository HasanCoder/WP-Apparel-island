var User = require('../models/User.js');
var express = require('express');
var bcrypt = require('bcryptjs');
var config = require('config');
var jwt = require('jsonwebtoken');
var auth = require('../middleware/AuthMiddleware.js');

const router = express.Router();

router.post('/', (req,res) => {

    

    const { email, password } = req.body;

    //validating fields
    if(!email || !password){
        return res.status(400).json({
            status: false,
            message: "Invalid or missing data"
        });
    }
    //validating email
    User.findOne({
        email: email
    }).then(user => {
        
        if( !user ){
            return res.status(400).json({
                status: false,
                message: "User does not exists"
            });
        }

        //Validate Password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' }); 
                
                jwt.sign(
                    { id:user.id },
                    config.get('jwtSecret'),
                    { expiresIn : 3600 },
                    (err, token) => {
                        if(err) throw err;

                        res.json({
                            token,
                            user:{
                                id: user.id,
                                name: user.name,
                                email: user.email
                            }
                        });
                    }
                );
                
            });
        
        
    }).catch(err => {
        console.log('auth/ err ',err);
        res.status(500).send();
    });


});

router.post('/user' , (req,res) => {
    const {userId} = req.body; 
    User.findById(userId).
        select('-password')
        .then(user => {
            res.json(user);
        }).catch(err => {
            console.log('auth/user err', err);
            res.status(500).send();

        });

})

module.exports = router;