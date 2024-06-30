const { createToken } = require('../middlewares/token')
const userController = require('../DL/controller/user.controller')
const chatServices = require('./chat.services')

async function login(loginDetails) {
    if (!loginDetails.email && !loginDetails.password) throw { msg: "נא להכניס מייל וסיסמא" }
    const user = await userController.readOne({ email: loginDetails.email, password: loginDetails.password, isActive: true })
    if (!user) throw { msg: 'user not exist' }
    const token = await createToken(user)
    const chatsNotReadOb = await chatServices.getChatsNotRead(user)
    const userWithTokenAndChatsNotRead = { user, 'token': token, chatsNotReadOb }
    return userWithTokenAndChatsNotRead
}

async function create(data) {
    const isUserExist = await userController.readOne({ email: data.email })
    if (isUserExist) throw 'this email is already exist'
    if (!data.avatar) {
        const nameForAvatar = data.firstName[0] + data.lastName[0]
        data = { ...data, avatar: nameForAvatar }
    }
    const result = await userController.create(data)
    return result
}
async function read(filter) {
    return await userController.read(filter)
}
async function readOne(filter) {
    const result = await userController.readOne({ ...filter, isActive: true })
    return result
}

async function updateStatusChat(user, data, chatId) {
    const userFromData = await userController.readOneWithLean({ '_id': user._id, isActive: true })
    const chats = userFromData.chats.map(c => c.chat == chatId ? { ...c, ...data } : c)
    return await userController.update(user._id, { chats })
}
async function deleteChatFromUser(user, chatId) {
    const userFromData = await userController.readOneWithLean({ '_id': user._id, isActive: true })
    const chats = []
    for (i of userFromData.chats) {
        if (!(i.chat == chatId)) {
            chats.push(i)
        }
        else {
            continue
        }
    }
    return await userController.update(user._id, { chats })
}

async function updateUser(user, data) {
    if (Object.keys(data).includes('emails')) throw { msg: "can't change this list" }
    return await userController.update(user._id, data)
}
async function readByFlags(id, flags, populate) {
    return await userController.readByFlags(id, flags, populate)
}
async function sava(user) {
    return user.sava()
}

module.exports = { login, create, deleteChatFromUser, read, readOne, sava, updateUser, updateStatusChat, readByFlags }