const express = require('express')
const router = express.Router();

//@route GET  api/users/test
//@desc       get all users
//@access     public
router.get('/test', (req, res) => {
  res.json({
    title: 'test'
  })
})

module.exports = router