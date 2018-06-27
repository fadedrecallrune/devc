const express = require('express');
const mongoose = require('mongoose')
const passport = require('passport')

const router = express.Router()

//post validation
const validatePostInput = require('../../validation/post')

// post model
const Post = require('../../models/post')
const Profile = require('../../models/profile')



// @route GET api/posts/
// @desc get posts
// @access public
router.get('/', (req,res) => {
  Post.find()
  .sort({date: -1})
  .then(posts => res.json(posts))
  .catch(err => res.status(404).json({nopostsfound:'there are no posts'}))
})

// @route GET api/posts/:id
// @desc get posts by id
// @access public
router.get('/:id', (req,res) => {
  Post.findById(req.params.id)
  .then(post => res.json(post))
  .catch(err => res.status(404).json({nopostfound: 'no such post'}))
})

// @route POST api/posts/
// @desc create post 
// @access private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid} = validatePostInput(req.body);

  //check validation
  if(!isValid){
    //if any errors send 400 with err object
    return res.status(400).json(errors)
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  })
  newPost.save().then(post => res.json(post))
})


// @route DELETE api/posts/:id
// @desc delete post 
// @access private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
  .then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        //check for post owner
        if(post.user.toString() !== req.user.id){
          return res.status(401).json({notauthorized: 'user not authorized'})
        }
        //delete
        post.remove().then(() => res.json({success: true}))
      })
      .catch(err => res.status(404).json({postnotfound:'no post found'}))
  })
})

// @route POST api/posts/like/:id
// @desc create a like post 
// @access private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
  .then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
          return res.status(400).json({alreadyliked: 'user already liked this post'})
        }
        //add the user id to likes array
        post.likes.unshift({user: req.user.id})
        post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({postnotfound:'no post found'}))
  })
})

// @route POST api/posts/unlike/:id
// @desc unlike a post 
// @access private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
  .then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
          return res.status(400).json({alreadyliked: 'user have not liked this post'})
        }
        //get the remove index 
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.userid);

        //splice it out of array
        post.likes.splice(removeIndex, 1);

        //save
        post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({postnotfound:'no post found'}))
  })
})


// @route POST api/posts/comment/:id
// @desc add comment to post
// @access private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
  const { errors, isValid} = validatePostInput(req.body);

  //check validation
  if(!isValid){
    //if any errors send 400 with err object
    return res.status(400).json(errors)
  }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.name,
        user: req.user.id
      }
      //add to comments array
      post.comments.unshift(newComment);

      //save
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({postnotfound: 'no post to comment'}))
})

// @route DELETE api/posts/comment/:id/:comment_id
// @desc delete comment from post
// @access private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req,res) => {
  
  Post.findById(req.params.id)
    .then(post => {
      
      //check if the comment exist
      if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
        return res.status(404).json({commentnotexists: 'comment does not exist'})
      }
      // remove index
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      //splice outta array
      post.comments.splice(removeIndex, 1)

      //save
      post.save().then(post => res.json(post))

    })
    .catch(err => res.status(404).json({postnotfound: 'no post to comment'}))
})

module.exports = router;
