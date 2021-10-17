const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/users")

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
app.use("/images", express.static(path.join("backend/images")));  //make the server to access the images

app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    response.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);


module.exports = app;