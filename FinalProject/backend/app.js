const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();
//Ki42Fs5l3FcOj19E
mongoose.connect("mongodb+srv://user1:Ki42Fs5l3FcOj19E@cluster0.u32ej.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    response.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});


app.post("/api/posts", (request, response, next) => {
    const post = new Post({
        title: request.body.title,
        content: request.body.content
    });
    post.save().then(createdPost => {
        response.status(201).json({
            message: 'Post added successfully.',
            postId : createdPost._id
        });
    }); 
});

app.get('/api/posts',(request, response, next) => {
    Post.find().then(docusments => {
        // console.log(docusments);
        response.status(200).json({
            message: 'Posts fetched succesfully!',
            posts: docusments
        });
    });  
});

app.delete("/api/posts/:id", (request, response, next) => {
    Post.deleteOne({_id: request.params.id}).then(result => {
        console.log(result);
        response.status(200).json({message: 'Post deleted!'});
    });    
});

module.exports = app;