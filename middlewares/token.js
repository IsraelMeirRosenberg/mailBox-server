const jwt = require('jsonwebtoken')
const userModel = require('../DL/models/user.model')
async function createToken(user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    return token
}

async function checkToken(token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findOne({ _id: payload._id, isActive: true })
    if (!user) throw 'not found user(token)'
    return user
}

module.exports = { createToken, checkToken }