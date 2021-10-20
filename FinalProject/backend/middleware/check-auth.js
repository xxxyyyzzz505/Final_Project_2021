const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(" ")[1]; 
        //"Bearer tokentokentoken"
        const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
        request.userData = { email: decodedToken.email, userId: decodedToken.userId || "616fcc3e5a65f52add8305ab" }
        next();
    } catch (error) {
        response.status(401).json({ message: "You are not authenticated!"});
    }

};