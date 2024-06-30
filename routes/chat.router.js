const express = require('express');
const router = express.Router()
const { checkUser } = require('../middlewares/middleWare.checkToken')
const chatServices = require('../DB/chat.services')

router.get('/:chatId', checkUser, async (req, res) => {
    try {
        const chatId = req.params.chatId
        const user = req.user
        const result = await chatServices.readOne(user, chatId)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
        console.log(error);
    }
})


router.post('/createMessage/:chatId', checkUser, async (req, res) => {
    try {
        const chatId = req.params.chatId
        const user = req.user
        const data = req.body
        const result = await chatServices.createMsg(user, chatId, data)
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
})

router.post('/createChat', checkUser, async (req, res) => {
    try {
        const data = req.body
        const user = req.user
        const result = await chatServices.createChat(user, data)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
        console.log(error);
    }
})


router.put('/:chatId', checkUser, async (req, res) => {
    try {
        const user = req.user
        const chatId = req.params.chatId
        const data = req.body
        const result = await chatServices.updateStatusChat(user, data, chatId)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
        console.log(error);
    }
})

router.delete('/:chatId', checkUser, async (req, res) => {
    try {
        const user = req.user
        const chatId = req.params.chatId
        const result = await chatServices.deleteChatFromUser(user, chatId)
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

module.exports = router