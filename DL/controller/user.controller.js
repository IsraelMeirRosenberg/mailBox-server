const { findByIdAndUpdate } = require('../models/chat.model')
const userModel = require('../models/user.model')
async function create(data) {
    return await userModel.create(data)
}
async function read(filter) {
    return await userModel.find(filter)
}
async function readOne(filter) {
    return await userModel.findOne(filter)
}
async function readOneWithLean(filter) {
    return await userModel.findOne(filter).lean()
}

async function update(id, data) {
    return await userModel.findByIdAndUpdate(id, data, { new: true })
}
async function del(id) {
    return await findByIdAndUpdate(id, { isActive: false }, { new: true })
}
async function save(user) {
    return await user.save()
}
async function readByFlags(id, flags = [], populate = {}) {
    const data = await userModel.findById(id, { isActive: true })
    data.chats = data.chats.filter(c => flags.every(f => {
        if (typeof f === 'object') {
            const [[k, v]] = Object.entries(f)
            return c[k] == v
        }
        return c[f]
    }))
    if (populate.chats) data = await data.populate('chats.chat')
    if (populate.users) data = await data.populate({ path: 'chats.chat.members', select: 'fullName avatar' })
    return data.toObject()
}


module.exports = { create, read, readOne, save, del, update, readByFlags, readOneWithLean }