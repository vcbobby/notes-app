const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = process.env
module.exports = (req, res, next) => {
    const authorization = req.get('authorization')
    let token = null
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7)
    }

    let decodedToken = {}

    try {
        decodedToken = jwt.verify(token, PRIVATE_KEY, {
            expiresIn: 60 * 60 * 24 * 7,
        })
    } catch (error) {}

    if (!token || !decodedToken.id) {
        return res.status(401).json({
            error: 'Token is missing or invalid',
        })
    }

    const { id: userId } = decodedToken

    req.userId = userId
    next()
}
