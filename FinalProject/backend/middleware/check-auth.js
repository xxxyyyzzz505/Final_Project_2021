const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(" ")[1]; 
        //"Bearer tokentokentoken"
        const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
        request.userData = { email: decodedToken.email, userId: decodedToken.userId }
        next();
    } catch (error) {
        response.status(401).json({ message: "You are not authenticated!"});
    }

};