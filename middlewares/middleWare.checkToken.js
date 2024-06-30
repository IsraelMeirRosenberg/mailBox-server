const { checkToken } = require('./token')
const checkUser = async function (req, res, next) {
    try {
        const token = req.headers.authorization.split('Bearer ')[1]
        if (!token) throw ({ msg: 'token not sent' })
        const user = await checkToken(token)
        req.user = user
        next()
    } catch (error) {
        console.log(error);
        res.status(402).send({ error })
    }
}
module.exports = { checkUser }