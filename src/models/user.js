const mongoose = require('mongoose');

const user = new mongoose.Schema(
    {
        firstName: { type: String},
        lastName: { type: String},
        email: { type: String, required: true },
        password: { type: String, required: true }
    },
    { collection: 'users' }
)

module.exports = mongoose.model('user', user);