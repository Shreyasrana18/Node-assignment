const mongoose = require("mongoose");
const { Snowflake } = require('@theinternetfolks/snowflake');
const MemberSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => Snowflake.generate().toString()
    },
    community: {
        type: String,
        ref: 'Community'
    },
    user: {
        type: String, ref: 'User'
    },
    role: {
        type: String, ref: 'Role'
    }

},
    {
        timestamps: true
});

module.exports = mongoose.model('Member', MemberSchema);