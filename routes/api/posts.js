const express = require('express')
const router = express.Router();

//@route GET  api/post/test
//@desc       get users posts
//@access     public
router.get('/test', (req, res) => {
  res.json({
    title: 'test'
  })
})

module.exports = router