const mongoose= require("mongoose");
const passport= require('passport');
const Profile= require('../../model/Profile');
const User= require('../../model/User');

// load validation
const validateProfileInput= require('../../validation/profile');
const validateExperienceInput= require('../../validation/experience');
const validateEducationInput= require('../../validation/education');

const express= require("express");
const router= express.Router();

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
    // destructing
    const {errors, isValid} = validateProfileInput(req.body);
    // check validate
   
    const profileFields={};
    profileFields.user=req.user.id;
    if(req.body.handle) profileFields.handle= req.body.handle;
    if(req.body.company) profileFields.company= req.body.company;
    if(req.body.website) profileFields.website= req.body.website;
    if(req.body.location) profileFields.location= req.body.location;
    if(req.body.status) profileFields.status= req.body.status;
    const skills= req.body.skills;
    if(typeof(req.body.skills !== undefined)){
        profileFields.skills= skills.split(",");
    }
    if(req.body.bio) profileFields.bio= req.body.bio;
    if(req.body.github_username) profileFields.github_username= req.body.github_username;
   
    // social
    profileFields.social={};
    if(req.body.youtube) profileFields.social.youtube= req.body.youtube;
    if(req.body.facebook) profileFields.social.facebook= req.body.facebook;
    if(req.body.twitter) profileFields.social.twitter= req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin= req.body.linkedin;


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
    if(!isValid){
        // return errors
        res.status(400).json(errors);
    }

});

// @route   GET api/profile/handle/:handle
// @desc    GET profile by handle 
// @access  Public
router.get('/handle/:handle',(req, res)=>{
    const errors={};
    Profile.findOne({handle:req.params.handle})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
    
            errors.nonprofile="No profile found";
            res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err=>{
        res.status(404).json(err);
    });
});

// @route   GET api/profile/user/:user_id
// @desc    GET profile by user_id
// @access  Public
router.get('/user/:user_id',(req, res)=>{
    const errors={};
    Profile.findOne({user: req.params.user_id})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            errors.nonprofile="No profile found";
            res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err=>{
        res.status(404).json(err);
    });
});

// @route   GET api/profile/all
// @desc    GET profile of all user
// @access  Public
router.get('/all', (req, res)=>{
    const errors={};
    Profile.find()
    .populate('user',['name','avatar'])
    .then(profiles=>{
        if(!profiles){
            errors.nonprofile= "There are no profiles found";
            return res.status(404).json(errors);
        }else{
            res.json(profiles);
        }
    })
    .catch(err=> res.status(404).json({profile: "There are no profile found"}));
});

// adding experinece
// @route   POST api/profile/experience
// @desc    POST the experience
// @access  Private
router.post('/experience', passport.authenticate('jwt',{session:false}), (req, res)=>{
    // import the ValidateExperienceInput and destruct into erros and isValid
    console.log(req.body);
    const {errors, isValid} = validateExperienceInput(req.body);
    // validation checking
    if(!isValid){
        // return errors
        res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id})
        .exec()
        .then(profile=>{
            if(profile){
                // extracting the experience fields and assigning on newExp object
                const newExp={
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                }
                // add the experience to the profile by unshifting technique
                profile.experience.unshift(newExp);
                // Saving new profile on Profile
                Profile(profile).save().then(profile=> res.json(profile));
            }
        })
});
// adding eduction
// @route   POST api/profile/education
// @desc    POST the education
// @access  Private
router.post('/education', passport.authenticate('jwt',{session:false}), (req, res)=>{
    // import the ValidateEducaitionInput and destruct into erros and isValid
    const {errors, isValid} = validateEducationInput(req.body);
    // validation checking
    if(!isValid){
        // return errors
        res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id})
        .exec()
        .then(profile=>{
            if(profile){
                // extracting the experience fields and assigning on newExp object
                const newEdu={
                    school: req.body.school,
                    degree: req.body.degree,
                    fieldofstudy: req.body.fieldofstudy,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                }
                // add the eduction to the profile by unshifting technique
                profile.education.unshift(newEdu);
                // Saving new profile on Profile
                Profile(profile).save().then(profile=> res.json(profile));
            }
        })
});

// Deleting experience
// @route   DELETE api/profile/education/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt',{session:false}), (req, res)=>{
    Profile.findOne({user: req.user.id})
        .exec()
        .then(profile=>{
            // Get remote index
            const removeIndex= profile.experience
                .map(item=> item.id)
                .indexOf(req.params.exp_id);
            // splice the array
            profile.experience.splice(removeIndex, 1);

            // save
            Profile(profile).save().then(profile=> res.json(profile));
        })
        .catch(err=> res.status(404).json(err));
    
});

// Deleting experience
// @route   DELETE api/profile/education/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt',{session:false}), (req, res)=>{
    Profile.findOne({user: req.user.id})
        .exec()
        .then(profile=>{
            // Get remote index
            const removeIndex= profile.education
                .map(item=> item.id)
                .indexOf(req.params.edu_id);
            // splice the array
            profile.education.splice(removeIndex, 1);

            // save
            Profile(profile).save().then(profile=> res.json(profile));
        })
        .catch(err=> res.status(404).json(err));
    
});
module.exports= router;