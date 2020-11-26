const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys')

var express = require("express");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Comments = require('./schema/comments');
var User = require('./schema/user');
var Posts = require('./schema/posts');
var port = process.env.port || 3000;


app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/comment'))

// DB connection
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })

var ObjectId = require('mongodb').ObjectID;
const oldPosts = [{
  title: 'Node Tutorial',
  description: 'Learing Node js is easy',
  postedBy: ObjectId("5fb17f1087fc16456c539b62")
},
{
  title: 'Java 8',
  description: 'Welcome to java 8 course',
  postedBy: ObjectId("5fb17f7087fc16456c539b63")
}
]
  
// inserting post from backend
//Posts.insertMany(oldPosts);


app.get('/', function (req, res) {
  res.render('index');
});

io.on('connection', function (socket) {
  socket.on('comment', function (data) {
    const comment = new Comments(data);
    console.log("postID:"+data.postId)
    console.log("comment in app:"+comment)
    comment
    .save()
    .then(comment => {
      return Posts.findById(data.postId);
    })
    .then(post => {
      post.comments.unshift(comment);
      return post.save();
    })
    .then(post => {
      // to do
    })
    .catch(err => {
      console.log(err);
    });
    socket.broadcast.emit('comment', data);
  });

});

http.listen(port, function () {
  console.log("Server running at port " + port);
});