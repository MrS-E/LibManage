const mongoose = require('mongoose');

const object = new mongoose.Schema(
    {
        id:{type: String, required: true},
        title: { type: String, required: true},
        author: { type: String},
        publisher:{type: String},
        isbn: { type: String},
        keywords: { type: [String]},
        year: {type: Date},
        blurb: {type: String},
        img:{ type: String},
        img_desc:{type: String}
    },
    { collection: 'object' }
)

module.exports = mongoose.model('object', object);