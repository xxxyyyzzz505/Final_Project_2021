const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(" ")[1]; 
        //"Bearer tokentokentoken"
        jwt.verify(token, "secret_this_should_be_longer");
        next();
    } catch (error) {
        response.status(401).json({ message: "Auth Failed!"});
    }

};