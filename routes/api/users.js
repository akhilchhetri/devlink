// initiate express
const express= require('express');
const router= express.Router();

// passport
const passport= require('passport');

// load user model
const User= require('../../model/User');

// using gravatar
const gravatar= require('gravatar');

// use JWT
const jwt= require('jsonwebtoken');

// bcytpt 
const bcrypt= require('bcryptjs');

// import keys
const keys= require('../../config/keys');

// load validator
const validateRegisterInput= require('../../validation/register');
// load Validator login
const validateLoginInput= require('../../validation/login');
// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test',(req, res)=>{
    res.json({
        "msg":"User works"
    });
});

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register',(req, res)=>{
    const {errors, isValid}= validateRegisterInput(req.body);
    // check validation
    if(!isValid){
        return res.status(400).json({errors});
    }
    User.findOne({
        email: req.body.email
    })
    .exec()
    .then(user=>{
        if(user){
            errors.email="Email Already exists";
            return res.status(400).json(errors);
        }else{
            const avatar= gravatar.url(req.body.email, {
                s: '200', //size 
                r: 'pg',  // rating
                d: 'mm'   // default
            });
            const newUser= new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

                bcrypt.hash(newUser.password, 10,(err, hash)=>{
                    if(err) throw err;
                    newUser.password=hash;
                    newUser.save()
                    .then(user=> res.json(user))
                    .catch(err=> console.log(err));
                });
            
        }
    });
});

// @route   GET api/users/login
// @desc    Login user
// @access  Public
router.post('/login',(req, res)=>{
    const {errors, isValid}= validateLoginInput(req.body);
    // check validation
    if(!isValid){
        return res.status(400).json({errors});
    }

    const email= req.body.email;
    const password1= req.body.password;
    // Find by User Email
    User.findOne({email: email}).exec()
    .then((user)=>{
        // check for user
        if(!user){
            errors.email="Email not found";
            return res.status(404).json(errors);
        }
        bcrypt.compare(password1, user.password, (err, success)=>{
            if(success){
                const payload={id: user.id,email:user.email, name: user.name, avatar: user.avatar};// creating JWT payload
                // sign token
                jwt.sign(
                    payload,
                    keys.secret,
                    { expiresIn: 3600 },
                    (err, token) => {
                        res.json({
                            msg:"Login Success",
                            token: "Bearer " + token
                        });
                    }
                );
            }else{
                errors.password="Password incorrect";
                res.status(400).json(errors);
            }
        });
    })
    .catch();
});

// @route   GET api/users/abc
// @desc    abc route to check protected route
// @access  Private
router.get('/abc', passport.authenticate('jwt', { session: false }), function(req, res) {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
  });
module.exports= router;