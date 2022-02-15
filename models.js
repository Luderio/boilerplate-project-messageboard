const mongoose = require('mongoose');


//SCHEMA
const ReplySchema = mongoose.Schema({
    text: {type: String, required: true},
    created_on: {type: Date, required: true},
    delete_password: {type: String, required: true},
    reported: {type: Boolean, default: false}
});

const MessageSchema = mongoose.Schema({
    board: {type: String, default: ''},
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    created_on: {type: Date},
    bumped_on: {type: Date},
    reported: {type: Boolean, default: false},
    replies: [ReplySchema]
});

//MODEL
const Message = mongoose.model('Message', MessageSchema);
const Reply = mongoose.model("Reply", ReplySchema);

module.exports = {Message, Reply};




