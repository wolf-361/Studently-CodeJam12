const jwt = require("jsonwebtoken");

function checkToken(userToken, jwt_secret_key) {
    let userID;

    try {
        userID = jwt.verify(userToken, jwt_secret_key);

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return false;
        }
    } 

    return userID;
}

module.exports = { checkToken };
