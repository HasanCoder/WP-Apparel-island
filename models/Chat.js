var mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    sender: String,
    time: {
      type: Date,
      default: Date.now
    },
    content: String,
    images: Array,
    order: String,
    phase: Number,
});

module.exports =  mongoose.model('chats', chatSchema);
