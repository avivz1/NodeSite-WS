const mongoose = require('mongoose');

let MovieSchema = new mongoose.Schema({
    name:String,
    genres:[String],
    image:String,
    premiered:String
})
module.exports = mongoose.model('movies',MovieSchema);