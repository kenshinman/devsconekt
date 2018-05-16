const express = require('express')
const router = express.Router();

//@route GET  api/profile/test
//@desc       get profile
//@access     private
router.get('/test', (req, res) => {
  res.json({
    title: 'test'
  })
})

module.exports = router;