const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
var Post = require('../schema/posts')
var Comment = require('../schema/comments');
var User = require('../schema/user')
var ObjectId = require('mongodb').ObjectID;


router.post("/posts/:postId/comments/:commentId/replies", (req, res) => {
    const { comment, commentedBy, commentId } = req.body
    if (!comment) {
        return res.status(422).json({ error: "please add comment" })
    }
    var reply_data = { "comment": comment, "commentedBy": commentedBy, "postId": req.params.postId }
    const reply = new Comment(reply_data);
    Post.findById(req.params.postId)
        .then(post => {
            Promise.all([
                reply.save(),
                Comment.findById(commentId),
            ])
                .then(([reply, comment]) => {
                    comment.comments.unshift(reply._id);
                    return Promise.all([
                        comment.save(),
                    ]);
                })
                .then(() => {
                    res.redirect("/posts/" + req.params.postId)
                })
                .catch(console.error);
            return post.save();
        })
});
    module.exports = router