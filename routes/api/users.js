const express= require('express');
const router= express.Router();

// load user model
const User= require('../../model/User');

// using gravatar
const gravatar= require('gravatar');

// bcytpt 
const bcrypt= require('bcryptjs');
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
    User.findOne({
        email: req.body.email
    })
    .exec()
    .then(user=>{
        if(user){
            return res.status(400).json({email:"Email Already Exists"});
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

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt,(err, hash)=>{
                    if(err) throw err;
                    newUser.password=hash;
                    newUser.save()
                    .then(user=> res.json(user))
                    .catch(err=> console.log(err));
                });
            });
        }
    });
});

// @route   GET api/users/login
// @desc    Login user
// @access  Public
router.post('/login',(req, res)=>{
    const email= req.body.email;
    const password= req.body.password;

    // Find by User Email
    User.findOne({email: email}).exec()
    .then(user=>{
        // check for user
        if(!user){
            return res.status(404).json({email: "User not found"});
        }
        // check password
        bcrypt.compare(password, user.password)
        .then(isMatch=>{
            if(isMatch){
                res.json({msg:"Sucess"});
            }else{
                return res.status(400).json({msg:"Password doesnot match"});
            }
        });
    })
    .catch();
});
module.exports= router;