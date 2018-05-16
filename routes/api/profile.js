const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


//Load Profile Model
const Profile = require('../../models/Profile')

//Load Profile Model
const User = require('../../models/User')


//@route GET  api/profile/test
//@desc       get profile
//@access     private
router.get('/test', (req, res) => {
  res.json({
    title: 'test'
  })
})


//@route GET  api/profile/
//@desc       get current user's profile
//@access     private
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  let errors = {
    success: false
  }
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors)
      }
    })
    .catch(err => {
      res.status(404).json(err)
    })
})

//@route POST  api/profile/
//@desc       create or edit user profile (creating and updating)
//@access     private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  let errors = {
    success: false
  }

  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  // Skills - Spilt into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({
    user: req.user.id
  }).then(profile => {
    if (profile) {
      //update
      Profile.findOneAndUpdate({
        user: req.user.id
      }, {
        $set: profileFields
      }, {
        new: true
      }).then(profile => res.json({
        success: true,
        profile
      }))
    } else {
      //create a new one

      //check if handle exists
      Profile.findOne({
        handle: profileFields.handle
      }).then(profile => {
        if (profile) {
          errors.handle = 'That handle already exists'.profileres.status(400).json(errors)
        }

        //create/ save profile
        new Profile(profileFields).save().then(profile => {
          res.json({
            success: true,
            profile
          })
        })
      })
    }
  })
})

module.exports = router;