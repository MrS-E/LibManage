const mongoose = require('mongoose');

const object = new mongoose.Schema(
    {
        title: { type: String, required: true},
        author: { type: String},
        isbn: { type: String},
        keywords: { type: Array},
        year: {type: Date},
        description:{ type: String},
        blurb: {type: String}
    },
    { collection: 'object' }
)

module.exports = mongoose.model('object', object);