const mongoose = require('mongoose');

const _return = new mongoose.Schema(
    {
        user_id: {type: String, required:true},
        book_id: {type: String, required: true}
    },
    { collection: 'returns' }
)

module.exports = mongoose.model('return', _return);