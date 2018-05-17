const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//post model
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')

const validatePostInput = require('../../validation/post')


//@route GET  api/post/test
//@desc       get users posts
//@access     public
router.get('/test', (req, res) => {
  res.json({
    title: 'test'
  })
})

//@route GET  api/posts
//@desc       get all posts
//@access     Public
router.get('/', (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => {
      res.json({
        success: true,
        posts
      })
    }).catch(err => res.status(404).json({
      success: false,
      msg: 'no posts found'
    }))
})

//@route GET  api/posts/:id
//@desc       get single post
//@access     Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      res.json({
        success: true,
        post
      })
    }).catch(err => res.status(404).json({
      success: false,
      msg: 'no post found'
    }))
})

//@route POST  api/posts
//@desc        create a post
//@access     Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validatePostInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  })

  newPost.save().then(post => {
    res.json({
      success: true,
      post
    })
  })
})


//@route DELETE  api/posts/:id
//@desc        delete a post
//@access     Private

router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id).then(post => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({
            success: false,
            msg: 'User not authorized'
          })
        }

        //delete
        post.remove().then(() => {
          res.json({
            success: true
          })
        })
      })
    }).catch(err => res.status(404).json({
      success: false,
      msg: 'Post not found'
    }))
})

//@route POST  api/posts/like/:id
//@desc        like a post
//@access     Private

router.post('/like/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.find(like => like.user.toString() === req.user.id)) {
            return res.status(400).json({
              success: false,
              msg: 'user already liked this post'
            })
          }

          //add user to likes
          post.likes.unshift({
            user: req.user.id
          });

          post.save().then(() => res.json({
            success: true,
            msg: 'post liked',
            post
          }))
        }).catch(err => res.status(400).json({
          success: false,
          msg: 'Post not liked '
        }))
    }).catch(err => res.status(404).json({
      success: false,
      msg: 'Post not found'
    }))
})


//@route POST  api/posts/unlike/:id
//@desc        delete a post
//@access     Private

router.post('/unlike/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (!post.likes.find(like => like.user.toString() === req.user.id)) {
            return res.status(400).json({
              success: false,
              msg: 'You have not liked this post'
            })
          }

          //remove this my users like and set the new value to the post.likes
          post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
          post.save().then(() => res.json({
            success: true,
            post
          }))
        }).catch(err => {
          console.log(err)
          res.status(400).json({
            success: false,
            msg: 'Post not unliked '
          })
        })
    }).catch(err => res.status(404).json({
      success: false,
      msg: 'Post not found'
    }))
})


//@route POST  api/posts/comment/:id
//@desc        Add comment to a post
//@access     Private
router.post('/comment/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validatePostInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  Post.findById(req.params.id)
    .then(post => {
      let newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }

      //add comment to post.comments
      post.comments.unshift(newComment);

      //save post
      post.save().then((post) => res.json({
        success: true,
        post
      }))
    }).catch(err => res.status(404).json({
      success: false,
      err
    }))
})

//@route DELETE  api/posts/comment/:id/:comment_id
//@desc        remove comment from a post
//@access     Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Post.findById(req.params.id)
    .then(post => {
      //check if comment exists
      if (!post.comments.find(comment => comment.id.toString() === req.params.comment_id)) {
        return res.status(404).json({
          success: false,
          msg: 'Comment does not exist'
        })
      }

      //remove comment
      post.comments = post.comments.filter(comment => comment.id.toString() !== req.params.comment_id);
      post.save().then(post => {
        res.json({
          success: true,
          post
        })
      })

    }).catch(err => res.status(404).json({
      success: false,
      err
    }))
})

module.exports = router