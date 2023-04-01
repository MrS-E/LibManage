const mongoose = require('mongoose');

const requests = new mongoose.Schema(
    {
        user_id: {type: Number, required: true},
        token: {type: Number, required: true}
    },
    { collection: 'requests' }
)

module.exports = mongoose.model('requests', requests);