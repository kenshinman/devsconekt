const express = require('express')
const router = express.Router();
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys')
const passport = require('passport')

//import user model
const User = require('../../models/User')

//load input validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

//@route POST  api/users/register
//@desc       register a user
//@access     public
router.post('/register', (req, res) => {
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      res.status(400).json({
        msg: "email already exists"
      })
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', //size
        r: 'pg', //rating
        d: 'mm' // default 
      })

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      })

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              //could do {success: true, user}
              user.password = undefined; // remove the password field so user does not see it
              res.json({
                success: true,
                user
              })
            })
            .catch(err => {
              console.log(err)
            })

        })
      })

    }
  })
})

//@route POST  api/users/login
//@desc       login a user
//@access     public
router.post('/login', (req, res) => {
  const {
    errors,
    isValid
  } = validateLoginInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const {
    email,
    password
  } = req.body;

  //find user by email
  User.findOne({
    email
  }).then(user => {
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors)
    }
    //check password
    bcrypt.compare(password, user.password)
      .then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          }

          //sign jwt
          jwt.sign(
            payload,
            keys.secretOrKey, {
              expiresIn: 3600
            },
            (err, token) => {
              if (err) {
                console.log(err);
                res.json({
                  success: false,
                  msg: 'error'
                });
              }
              delete user.password;
              console.log(user)
              res.json({
                success: true,
                token: `Bearer ${token}`
              })
            })
        } else {
          errors.password = 'Password Incorrect'
          return res.status(400).json(errors)
        }
      })
  })
})

//@route POST  api/users/current
//@desc       check get the owner of a token - HINT: comes from req.user
//@access     private
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})


module.exports = router