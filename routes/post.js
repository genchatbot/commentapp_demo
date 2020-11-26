const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
var Posts = require('../schema/posts')
var Comments = require('../schema/comments');
var User = require('../schema/user')

router.get('/posts', requireLogin, function (req, res) {

  Posts.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render('post-list', { posts: posts });
    }
  });
});

router.get('/posts/:id', requireLogin, function (req, res) {

  Posts.findOne({_id:req.params.id}).populate('comments').populate('commentedBy')
        .then(post => {
          console.log("post data"+post)
          res.render('post-detail', { post: post}); 
        })
        .catch(err => {
            console.log(err.message);
        });
});

module.exports = router