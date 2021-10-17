const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
});
//npm install --save mongoose-unique-validator

module.exports = mongoose.model('User', userSchema)

