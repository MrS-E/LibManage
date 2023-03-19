const mongoose = require('mongoose');

const files = new mongoose.Schema(
    {
        book_id: {type: String, required:true},
        file: {type: String, required: true}
    },
    { collection: 'files' }
)

module.exports = mongoose.model('files', files);