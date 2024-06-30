const chatController = require('../DL/controller/chat.controller')
const userServices = require('./user.service')
const mongoose = require('mongoose')
const { Flags } = require('../utility')
const funcs = {
    inbox: [Flags.Inbox, Flags, Flags.NotDeleted],
    notRead: [Flags.NotRead],
    send: [Flags.Sent],
    favorites: [Flags.Favorites],
    deleted: [Flags.Deleted],
    draft: [Flags.Draft]
}
async function read(userId, flag) {
    if (!funcs[flag]) throw 'לא נמסר איזה שיחות להביא'
    const chats = await userServices.readByFlags(userId, funcs[flag], { chats: true, users: true })
    return chats
}
async function readOne(userFromToken, chatId, isDeleted = false) {
    const user = await userServices.readOne({ '_id': userFromToken._id })
    const chat = user.chats.filter(c => isDeleted ?
        String(c.chat) == String(chatId) &&
        c.isDeleted === true :
        String(c.chat) == String(chatId))
    if (!chat[0]) throw 'not found message'
    return await chatController.readOne({ '_id': new mongoose.Types.ObjectId(chat[0].chat) })

}
async function createChat(user, data) {
    const objectIds = data.members.map(id => new mongoose.Types.ObjectId(id))
    const isMembersExists = await userServices.read({ '_id': { $in: objectIds }, 'isActive': true });
    if (!isMembersExists.length) throw 'לא נמצאו נמענים'
    const userFromData = await userServices.readOne({ "_id": user._id })
    data = { ...data, from: userFromData._id }
    const resultCreateChat = await chatController.create(data)
    resultCreateChat.msg.push({ from: data.from, content: data.content })
    resultCreateChat.save()
    const userUpdate = userFromData.chats.push({ chat: resultCreateChat._id, isSent: true })
    userFromData.save()
    isMembersExists.forEach(u => {
        u.chats.push({ chat: resultCreateChat._id, isRecieved: true })
        u.save()
    })
    return 'the message was sent seccess'
}
async function createMsg(user, chatId, data) {
    const chat = await readOne(user._id, chatId)
    chat.msg.push({ from: user._id, content: data.content })
    await chatController.save(chat)
    const userFromData = await userServices.readOne({ '_id': user._id })
    await userServices.updateStatusChat(userFromData, { isSent: true, isRead: true }, chatId)
    const isMembersExists = await userServices.read({ '_id': { $in: chat.members }, 'isActive': true });
    if (!isMembersExists.length) throw 'לא נמצאו נמענים'
    const updateFn = async (user) => await userServices.updateStatusChat(user, { isRecieved: true, isRead: false }, chatId)
    const updateMembers = await Promise.all(isMembersExists.map(updateFn))//שאול את יוסף על הפונקצייה הזאת
    if (!updateMembers.length) throw 'the update not seccessed'
    return updateMembers
}
async function updateStatusChat(user, data, chatId) {
    return await userServices.updateStatusChat(user, data, chatId)
}
async function deleteChatFromUser(user, chatId) {
    return await userServices.deleteChatFromUser(user, chatId)
}
function save(chat) {
    chat.sava()
    return chat
}
async function getChatsNotRead(user) {
    const userFromData = user || await userServices.readOne({ _id: user._id })
    let chatsNotRead = {}
    for (let i of userFromData.chats) {
        if (!i.isRead) {
            if (i.isSent) {
                chatsNotRead.isSent ? chatsNotRead = { ...chatsNotRead, isSent: chatsNotRead.isSent + 1 } : chatsNotRead = { ...chatsNotRead, isSent: 1 }
            }
            if (i.isRecieved) {
                chatsNotRead.isRecieved ? chatsNotRead = { ...chatsNotRead, isRecieved: chatsNotRead.isRecieved + 1 } : chatsNotRead = { ...chatsNotRead, isRecieved: 1 }
            }
            if (i.isFavorite) {
                chatsNotRead.isFavorite ? chatsNotRead = { ...chatsNotRead, isFavorite: chatsNotRead.isFavorite + 1 } : chatsNotRead = { ...chatsNotRead, isFavorite: 1 }
            }
            if (i.isDraft) {
                chatsNotRead.isDraft ? chatsNotRead = { ...chatsNotRead, isDraft: chatsNotRead.isDraft + 1 } : chatsNotRead = { ...chatsNotRead, isDraft: 1 }
            }
            if (i.isDeleted) {
                chatsNotRead.isDeleted ? chatsNotRead = { ...chatsNotRead, isDeleted: chatsNotRead.isDeleted + 1 } : chatsNotRead = { ...chatsNotRead, isDeleted: 1 }
            }
            if (i.isSpam) {
                chatsNotRead.isSpam ? chatsNotRead = { ...chatsNotRead, isSpam: chatsNotRead.isSpam++ } : chatsNotRead = { ...chatsNotRead, isSpam: 1 }
            }
        }
    }
    return chatsNotRead
}

exports.getChatsNotRead = getChatsNotRead
module.exports = { read, createChat, readOne, deleteChatFromUser, createMsg, save, updateStatusChat }
