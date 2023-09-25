const JWT = require("jsonwebtoken")

const secret = "$ecret@123"

function createUserToken(user) {

    const payload = {
        _id:user._id,
        email:user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    }
    var token = JWT.sign(payload,secret)

    return token
}

function validateToken(token) {

    const payload = JWT.verify(token,secret)
    return payload
}

module.exports = {createUserToken,validateToken}