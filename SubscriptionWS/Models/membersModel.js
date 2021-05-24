const mongoose = require('mongoose');

let MemberSchema = new mongoose.Schema({
    name:String,
    email:String,
    city:String
})
module.exports = mongoose.model('members',MemberSchema);