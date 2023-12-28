const mongoose = require('mongoose');
const validator = require('validator');
const { Snowflake } = require('@theinternetfolks/snowflake');


const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => Snowflake.generate().toString()
    },
    name: {
        type: String,
        required: [true, "Please Enter your Name"],
        minlength: [2, "Minium length should be 2"]
    },
    email: {
        type: String,
        required: [true, "Please enter your Email"],
        unique: true,
        validate: validator.isEmail,

    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Minium length should be 6"]

    },
},
    {
        timestamps: true
});

module.exports = mongoose.model('User', UserSchema);