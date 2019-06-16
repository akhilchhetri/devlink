const mongoose= require("mongoose");
const passport= require('passport');
const Profile= require('../../model/Profile');
const User= require('../../model/User');
const Post= require('../../model/Post');

// load validation
const validatePostInput= require('../../validation/posts');
// const validateExperienceInput= require('../../validation/experience');
// const validateEducationInput= require('../../validation/education');

const express= require("express");
const router= express.Router();

// @route   GET api/posts/test
// @desc    Get current users profile 
// @access  Private

router.get('/test', (req, res)=>res.json({msg:"Test works"}));
// @route   GET api/posts
// @desc    Get all posts 
// @access  Public
router.get('/',(req, res)=>{
    Post.find()
    .sort({date: -1})
    .then(posts=>res.json(posts))
    .catch(err=> res.json(err));
});

// @route   GET api/posts/:post_id
// @desc    Get single id
// @access  Public
router.get('/:post_id',(req, res)=>{
    console.log(req.params.post_id);
    Post.findById(req.params.post_id)
    .then(posts=>res.json(posts))
    .catch(err=> res.status(404).json({nopostfound: "No post found"}));
});


// @route   POST api/posts/
// @desc    POST the posts 
// @access  Private
router.post('/', passport.authenticate('jwt',{session: false}), (req, res)=>{
    console.log(req.body);
    const {errors, isValid} = validatePostInput(req.body);
    // validation checking
    if(!isValid){
        // return errors
        res.status(400).json(errors);
    }
    const newPost= new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save().then(post=> res.json(post));
});

// @route   DELETE api/posts/:post_id
// @desc    Delete single id
// @access  Private
router.delete('/:post_id',passport.authenticate('jwt',{session: false}),(req, res)=>{
    console.log(req.params.post_id);
    Profile.findOne({user: req.user})
    .then(profile=>{
        Post.findById(req.params.post_id)
        .then(post=>{
            if(post.user.toString()!== req.user.id){
                return res.status(401).json({notauthorized: "User is not authorized to delete post"});
            }
            // else Delete
            Post.deleteOne()
                .then(()=> res.json({success:true}));
        })
        .catch(err=>{
            res.status(404).json({postnotfound: "Post not found"});
        });
    })
    .catch(err=> res.status(404).json({nopostfound: "No post found"}));
});

// editing or updating the post
// @route   UPDATE api/posts/:post_id
// @desc    Updating single id
// @access  Private
// router.patch('/:post_id', passport.authenticate('jwt',{session:false}), (req, res)=>{
//     console.log(req.body);
//     const {errors, isValid} = validatePostInput(req.body);
//     const updatedPost= new Post({
//         text: req.body.text,
//         name: req.body.name,
//         avatar: req.body.avatar,
//         user: req.user.id
//     });
//     if(!isValid){
//        // return errors
//        res.status(400).json(errors);
//     }
//     Profile.findOne({user: req.user})
//     .then(profile=>{
//         Post.findById(req.params.post_id)
//         .then(post=>{
//             if(post.user.toString()!== req.user.id){
//                 return res.status(401).json({notauthorized: "User is not authorized to update post"});
//             }
//             // else Delete
//             console.log(updatedPost);
//             Post.update(updatedPost)
//                 .then(()=> res.json({success:true}));
//         })
//         .catch(err=>{
//             res.status(404).json({postnotfound: "Post not found"});
//         });
//     })
//     .catch(err=> res.status(404).json({nopostfound: "No post found"}));
// });

// @route   POST api/posts/like/:post_id
// @desc    POST single id
// @access  Private
router.post('/like/:post_id',passport.authenticate('jwt',{session: false}),(req, res)=>{
    console.log(req.params.post_id);
    Profile.findOne({user: req.user})
    .then(profile=>{
        Post.findById(req.params.post_id)
        .then(post=>{
            if(post.likes.filter(like=> like.user.toString() === req.user.id ).length > 0){
                res.status(400).json({alreadyliked:"User already liked the post"});
            }
            // else
            post.likes.unshift({user: req.user.id});
            // saving post
            post.save().then(post=> res.json(post));
        })
        .catch(err=>{
            res.status(404).json({postnotfound: "Post not found"});
        });
    })
    .catch(err=> res.status(404).json({nopostfound: "No post found"}));
});

// @route   POST api/posts/unlike/:post_id
// @desc    POST unlike single post
// @access  Private


module.exports= router;