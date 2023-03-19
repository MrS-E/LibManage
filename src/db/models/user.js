const mongoose = require('mongoose');

const user = new mongoose.Schema(
{
        _id:{type: Number, required: true},
        salutation: {type: String, enum: ['Herr', 'Frau', ''], default: ''},
        firstName: { type: String},
        lastName: { type: String, required: true},
        email: { type: String, required: true },
        password: { type: String, required: true },
        history: {type: [{book: {type: String, required: true}, start: {type: Date, required: true}, end: {type: Date}}]},
        role: {type: String, enum:['admin','user','worker'], default: 'user', required: true}
        },
    { collection: 'users' }
)

module.exports = mongoose.model('user', user);