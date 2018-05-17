const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


//Load Profile Model
const Profile = require('../../models/Profile')

//Load Profile Model
const User = require('../../models/User')

//load validate profile
const validateProfileInput = require('../../validation/profile')

//validate experience input
const validateExperienceInput = require('../../validation/experience')

//validate experience input
const validateEducationInput = require('../../validation/education')


//@route GET  api/profile/all
//@desc       get get all users' profile
//@access     public
router.get('/all', (req, res) => {
  const errors = {}
  errors.success = false;
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles'
        res.status(404).json(errors)
      }

      res.json({
        success: true,
        profiles
      })
    }).catch(err => {
      errors.noprofile = 'There are no profiles'
    })
})

//@route GET  api/profile/handle/:handle
//@desc       get any user's profile by handle
//@access     public

router.get('/handle/:handle', (req, res) => {
  const errors = {}
  errors.success = false;
  Profile.findOne({
      handle: req.params.handle
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        res.status(404).json(errors)
      }

      res.json({
        success: true,
        profile
      })
    }).catch(err => res.status(404).json(err))
})

//@route GET  api/profile/user/:user_id
//@desc       get any user's id
//@access     public

router.get('/user/:user_id', (req, res) => {
  const errors = {}
  errors.success = false;

  Profile.findOne({
      user: req.params.user_id
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        res.status(404).json(errors)
      }

      res.json({
        success: true,
        profile
      })
    }).catch(err => {
      errors.profile = 'there is no profile for this user';
      res.status(404).json(errors)
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
    }).populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors)
      }
      res.json({
        success: true,
        profile
      })
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


  const {
    errors,
    isValid
  } = validateProfileInput(req.body)
  errors.success = false;
  if (!isValid) {
    //return errors with 400 status
    return res.status(400).json({
      errors
    })
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

//@route POST  api/profile/experience
//@desc       Add experience to profile
//@access     private

router.post('/experience', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  const {
    errors,
    isValid
  } = validateExperienceInput(req.body)

  if (!isValid) {
    return res.status(404).json(errors)
  }
  errors.success = false;
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      }

      //add to experience array
      profile.experience.unshift(newExp)

      profile.save().then(profile => res.json({
        success: true,
        profile
      }))

    })
})

//@route POST  api/profile/education
//@desc       Add education to profile
//@access     private

router.post('/education', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  const {
    errors,
    isValid
  } = validateEducationInput(req.body)

  if (!isValid) {
    return res.status(404).json(errors)
  }
  errors.success = false;
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      }

      //add to experience array
      profile.education.unshift(newEdu)

      profile.save().then(profile => res.json({
        success: true,
        profile
      }))

    })
})

//@route DELETE  api/profile/experience/:exp_id
//@desc       delete experience
//@access     private

router.delete('/experience/:exp_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  // errors.success = false;
  // console.log(req.params.exp_id)
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      //get remove index
      // console.log(profile)
      const newExps = profile.experience.filter(exp => exp.id !== req.params.exp_id)
      profile.experience = newExps;
      profile.save().then(profile => {
        res.json({
          success: true,
          profile
        })
      })
    }).catch(err => res.status(404).json(err))
})

//@route DELETE  api/profile/education/:edu_id
//@desc       delete experience
//@access     private

router.delete('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOneAndRemove({
      user: req.user.id
    })
    .then(() => {
      User.findOneAndRemove({
          _id: req.user.id
        })
        .then(() => {
          res.json({
            success: true
          })
        })
    })
})

//@route DELETE  api/profile/education/:edu_id
//@desc       delete experience
//@access     private

router.delete('/education/:edu_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  // errors.success = false;
  console.log(req.params.edu_id)
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      //get remove index
      // console.log(profile)
      const newEdus = profile.education.filter(edu => edu.id !== req.params.edu_id)
      profile.education = newEdus;
      profile.save().then(profile => {
        res.json({
          success: true,
          profile
        })
      })
    }).catch(err => res.status(404).json(err))
})

module.exports = router;