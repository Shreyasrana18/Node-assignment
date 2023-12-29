const mongoose = require('mongoose');
const { Snowflake } = require('@theinternetfolks/snowflake');

const communitySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => Snowflake.generate().toString(),
    },
    name: {
        type: String,
        required: [true, "Please Enter your Name"],
    },
    slug: {
        type: String,
        unique: false,
    },
    owner: {
        type: String,
        ref: 'User'
    }
}, {
    timestamps: true,

});

module.exports = mongoose.model('Community', communitySchema);