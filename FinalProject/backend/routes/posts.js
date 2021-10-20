
const express = require("express");
const { url } = require("inspector");
const multer = require("multer");
const { createPostfix } = require("typescript");

const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth")

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

router.post(
    "", 
    checkAuth,
    multer({storage: storage}).single("image"), 
    (request, response, next) => {

        const url = request.protocol + '://' + request.get("host");
        const post = new Post({
            title: request.body.title,
            content: request.body.content,
            imagePath: url + "/images/" + request.file.filename,
            creator: request.userData.userId
        });
    post.save().then(createdPost => {
        response.status(201).json({
            message: 'Post added successfully.',
            post: {
                // title: createdPost.title,
                // content: createdPost.content,
                // imagePath: createdPost.imagePath,
                ...createdPost,
                id: createdPost._id
            }
        });
    }); 
    }
);

// Edit Posts:
router.put(
    "/:id", 
    checkAuth,
    multer({storage: storage}).single("image"), 
    (request, response, next) => {
        let imagePath = request.body.imagePath;
        if (request.file) {
            const url = request.protocol + '://' + request.get("host");
            imagePath = url + "/images/" + request.file.filename
        }
        const post = new Post ({
            _id: request.body.id,
            title: request.body.title,
            content: request.body.content,
            imagePath: imagePath,
            creator: request.userData.userId
        });
        // console.log(post);
        Post.updateOne(
            { _id: request.params.id, creator: request.userData.userId }, 
            post)
            .then(result => {
                if (result.nModified > 0) {
                    response.status(200).json({message: 'Update successful!'});
                } else {
                    response.status(401).json({message: 'Not Authorized!'});
                }
            });
    }
);

router.get("",(request, response, next) => {
    const pageSize = +request.query.pagesize;
    const currentPage = +request.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery.then(docusments => {
        // console.log(docusments);
        fetchedPosts = docusments;
        return Post.count();
    })
    .then(count => {
        response.status(200).json({
            message: 'Posts fetched succesfully!',
            posts: fetchedPosts,
            maxPosts: count
        });
    });  
});

// For deleting:
router.get("/:id", (request, response, next) => {
    Post.findById(request.params.id).then(post => {
        if (post) {
            response.status(200).json(post);
        } else {
            response.status(404).json({ message: 'Post not found!' });
        }
    })
})

router.delete("/:id", checkAuth, (request, response, next) => {
    Post.deleteOne({ _id: request.params.id, creator: request.userData.userId })
        .then(result => {
        // console.log(result);
        if (result.n > 0) {
            response.status(200).json({message: 'Post deleted!'});
        } else {
            response.status(401).json({message: 'Not Authorized!'});
        }    
    });    
});

module.exports = router;