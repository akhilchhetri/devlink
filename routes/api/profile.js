const mongoose= require("mongoose");
const passport= require('passport');
const Profile= require('../../model/Profile');
const User= require('../../model/User');

const express= require("express");
const router= express.Router();

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
// router.get('/test',(req, res)=>{
//     res.json({
//         "msg":"Profile works"
//     });
// });

// @route   GET api/profile/
// @desc    Get current users profile 
// @access  Private
router.get('/',passport.authenticate('jwt', {session: false}),(req, res)=>{
    const errors={};
    Profile.findOne({user: req.user.id})
        .then(profile=>{
            if(!profile){
                errors.nonprofile="There is no the profile for this user";
                return res.status(400).json(errors);
            }
            res.json(profile);
        })
        .catch(err=>{
            res.status(404).json(err);
        });
    
});


module.exports= router;