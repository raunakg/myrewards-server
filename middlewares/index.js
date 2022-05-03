const jwt = require('jsonwebtoken')

const requireSignin = (req, res, next) => {
    const authHeader = req.cookies.token
    if (authHeader) {
        const token = authHeader
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) res.status(403).json('Token is not valid!')
            req.user = user
            next()
        })
    } else {
        return res.status(401).json('You are not authenticated!')
    }
}

module.exports = { requireSignin }
