const express = require('express')
const userRouter = express.Router()
const userServices = require('../DB/user.service')
const { checkUser } = require('../middlewares/middleWare.checkToken')
userRouter.post('/login', async (req, res) => {
    try {
        console.log(userIp);
        const detailsUser = req.body
        const result = await userServices.login(detailsUser)
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
})
userRouter.post('/', async (req, res) => {
    try {
        const data = req.body
        const result = await userServices.create(data)
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
})
userRouter.get('/', checkUser, async (req, res) => {
    try {
        const user = req.user
        const filter = { _id: user._id }
        const result = await userServices.readOne(filter)
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
})
userRouter.delete('/', checkUser, async (req, res) => {
    try {
        const user = req.user
        const result = await userServices.updateUser(user, { isActive: false })
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
})
userRouter.put('/:chatId', checkUser, async (req, res) => {
    try {
        const chatId = req.params.chatId
        const user = req.user
        const data = req.body
        const result = await userServices.updateStatusChat(user, data, chatId)
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
})
userRouter.put('/', checkUser, async (req, res) => {
    try {
        const user = req.user
        const data = req.body
        const result = await userServices.updateUser(user, data)
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
})
module.exports = userRouter 