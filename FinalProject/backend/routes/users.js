const express = require("express");

const User = require("../models/user");
//npm install --save bcrypt
const bcrypt = require("bcrypt");
//npm install --save jsonwebtoken
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", (request, response, next) => {
    bcrypt.hash(request.body.password, 10)
        .then(hash => {
            const user = new User({
                email: request.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    response.status(201).json({
                        message: 'User Created!',
                        result: result
                    });
                })
                .catch(error => {
                    response.status(500).json({
                        error: error
                    })
                });  
        });
});

router.post("/login", (request, response, next) => {
    User.findOne({ email: request.body.email }).then(user => {
        if(!user) {
            return response.status(401).json({
                message: "Auth Failed."
            });
        }
        return bcrypt.compare(request.body.password, user.password);
    })
    .then(result => {
        if (!result) {
            return response.status(401).json({
                message: "Auth Failed."
            });
        }
    })
    .catch(error => {
        return response.status(401).json({
            message: "Auth Failed."
        });
    });
});

module.exports = router;

