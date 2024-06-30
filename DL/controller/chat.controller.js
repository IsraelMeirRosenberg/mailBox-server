const chatModel = require('../models/chat.model');
async function create(data) {
    return await chatModel.create(data)
}
async function read(filter) {
    return await chatModel.find(filter)
}
async function readOne(filter) {
    return await chatModel.findOne(filter)
}
async function update(id, data) {
    return await chatModel.findByIdAndUpdate(id, data, { new: true })
}
async function del(id) {
    return await chatModel.findByIdAndUpdate(id, { isActive: false }, { new: true })
}
async function save(chat) {
    chat.save()
    return chat
}

module.exports = { create, update, read, readOne, del, save }