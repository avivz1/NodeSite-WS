const mongoose = require('mongoose');

let SubscriptionSchema = new mongoose.Schema({
    memberId: String,
    movies: [{movieId : String , date : String}]
})
module.exports = mongoose.model('subscriptions',SubscriptionSchema);