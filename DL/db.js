const mongoose = require('mongoose')
async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI)
            .then(r => console.log('db connect'))
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect }