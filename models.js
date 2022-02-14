const mongoose = require('mongoose');
const { Schema } = mongoose;

//SCHEMA
const MessageSchema = new Schema({
    board: {type: String, default: ''},
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    created_on: {type: String},
    bumped_on: {type: String},
    reported: {type: Boolean, default: false},
    replies: [ReplySchema]
});

const ReplySchema = new Schema({
    text: {type: String, required: true},
    created_on: {type: String},
    delete_password: {type: String, required: true},
    reported: {type: Boolean, default: false}
});

//MODEL
const NewMessage = mongoose.model('NewMessage', MessageSchema);
const NewReply = mongoose.model("NewReply", ReplySchema);

module.exports = {NewMessage, NewReply}

