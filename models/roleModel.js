const mongoose = require("mongoose");
const { Snowflake } = require('@theinternetfolks/snowflake');




const roleSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => Snowflake.generate().toString()
    },
    name: {
        type: String,
        required: [true, "Please Enter your Name"],
        unique: true
    },

},
    {
        timestamps: true

    });

module.exports = new mongoose.model('Role', roleSchema);