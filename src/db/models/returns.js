const mongoose = require('mongoose');

const _return = new mongoose.Schema(
    {
        user_id: {type: Number, required:true},
        book_id: {type: Number, required: true},
        returned: {type: Date, required: true}
    },
    { collection: 'returns' }
)

module.exports = mongoose.model('return', _return);