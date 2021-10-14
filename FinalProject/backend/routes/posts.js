
const express = require("express");
const multer = require("multer");

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (request, file, callback)  => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        callback(error, "backend/images");
    },
    filename: (request, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + extension);
    }
});

router.post("", multer({storage: storage}).single("image"), (request, response, next) => {
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

router.put("/:id", (request, response, next) => {
    const post = new Post({
        _id: request.body.id,
        title: request.body.title,
        content: request.body.content
    });
    Post.updateOne({_id: request.params.id}, post)
        .then(result => {
            console.log(result);
            response.status(200).json({message: 'Update successful!'});
        })
});

router.get("",(request, response, next) => {
    Post.find().then(docusments => {
        // console.log(docusments);
        response.status(200).json({
            message: 'Posts fetched succesfully!',
            posts: docusments
        });
    });  
});

// For editting:
router.get("/:id", (request, response, next) => {
    Post.findById(request.params.id).then(post => {
        if (post) {
            response.status(200).json(post);
        } else {
            response.status(404).json({ message: 'Post not found!' });
        }
    })
})

router.delete("/:id", (request, response, next) => {
    Post.deleteOne({_id: request.params.id}).then(result => {
        console.log(result);
        response.status(200).json({message: 'Post deleted!'});
    });    
});

module.exports = router;