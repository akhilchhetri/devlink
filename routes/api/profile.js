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
        .exec()
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
// @route   POST api/profile/
// @desc    POST current users profile 
// @access  Private
router.post('/',passport.authenticate('jwt',{session: false}), (req, res)=>{
    const profileFields={};
    profileFields.user=req.user.id;
    if(req.body.handle) profileFields.handle= req.body.handle;
    if(req.body.company) profileFields.company= req.body.company;
    if(req.body.website) profileFields.website= req.body.website;
    if(req.body.location) profileFields.location= req.body.location;
    if(req.body.status) profileFields.status= req.body.status;

    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills= req.body.skills.split(',');
    }
    if(req.body.bio) profileFields.bio= req.body.bio;
    if(req.body.github_username) profileFields.bio= req.body.github_username;
   
    // social
    profileFields.social={};
    if(req.body.youtube) profileFields.social.youtube= req.body.youtube;
    if(req.body.facebook) profileFields.social.youtube= req.body.facebook;
    if(req.body.twitter) profileFields.social.youtube= req.body.twitter;
    if(req.body.linkedin) profileFields.social.youtube= req.body.linkedin;


    // if(req.body.date) profileFields.bio= req.body.date;
    Profile.findOne({user: req.user.id})
    .then(profile=>{
        if(profile){
            // Update
            Profile.findOneAndUpdate({user: req.user.id},{$set: profileFields},{new: true})
            .then(profile=>res.json(profile));

        }else{
            // create

            // check for handle
            Profile.findOne({handle: profileFields.handle})
                .then(profile=>{
                    if(profile){
                        errors.handle="That handle already exits";
                        res.status(400).json(errors);
                    }
                    // save profile
                    new Profile(profileFields).save().then(profile=> res.json(profile));
                });
        }
    });

});

module.exports= router;