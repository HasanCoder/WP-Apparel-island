var mongoose = require('mongoose');

const forumSchema = mongoose.Schema({
    sender: String,
    time: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      default: "Open"
    },
    content: String,
    title: String,
    comments: Array

});

module.exports = mongoose.model('forums', forumSchema);
