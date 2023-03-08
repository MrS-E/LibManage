const mongoose = require('mongoose');

const object = new mongoose.Schema(
    {
        _id:{type: String, required: true},
        title: { type: String, required: true},
        author: { type: String},
        publisher:{type: String},
        isbn: { type: String},
        keywords: { type: [String]},
        typ: {type: String, required: true, enum:['E-Book', 'Buch', 'Zeitschrift', 'E-Paper', 'CD', 'DVD', 'E-Audio', 'E-Video'], default: 'Buch'},
        year: {type: Date},
        blurb: {type: String},
        small_desc: {type: String},
        img:{ type: String},
        img_desc:{type: String},
        history: {type: [{user: {type: String, required: true}, start:{type: Date, required: true}, end:{type: Date}}]},
        read: {type: String},
        page: {type: Number},
        standort: {type: String}
    },
    { collection: 'object' }
)

module.exports = mongoose.model('object', object);