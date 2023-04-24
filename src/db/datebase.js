//This code was copied from https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/
const mongoose = require('mongoose');
const config = require('./config')

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.set('strictQuery', false)
        mongoose.connect(config.mongodbUri)
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error('Database connection error: ', err)
            })
    }
}

module.exports = new Database()