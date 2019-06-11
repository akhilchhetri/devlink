// initiate express
const express= require('express');
const router= express.Router();

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
    const email= req.body.email;
    const password1= req.body.password;

    // Find by User Email
    User.findOne({email: email}).exec()
    .then((user)=>{
        // check for user
        if(!user){
            return res.status(404).json({msg: "User not found"});
        }
        bcrypt.compare(password1, user.password, (err, success)=>{
            if(success){
                const payload={id: user.id, name: user.name, avatar: user.avatar};// creating JWT payload
                // sign token
                jwt.sign(
                    payload,
                    keys.secret,
                    {expiresIn: '3600'},
                    (err, token)=>{
                        res.json({
                            msg:"Login successfull Success",
                            // user:user,
                            token: "Bearer " + token
                        });
                    }
                );
            }else{
                res.json({password:"password doesnot match"});
            }
        });
    })
    .catch();
});

module.exports= router;