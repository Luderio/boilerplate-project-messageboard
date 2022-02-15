const mongoose = require('mongoose');


//SCHEMA
const ReplySchema = mongoose.Schema({
    text: {type: String, required: true},
    created_on: {type: String},
    delete_password: {type: String, required: true},
    reported: {type: Boolean, default: false}
});

const MessageSchema = mongoose.Schema({
    board: {type: String, default: ''},
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    created_on: {type: String},
    bumped_on: {type: String},
    reported: {type: Boolean, default: false},
    replies: [ReplySchema]
});

    

    //MODEL
    const NewMessage = mongoose.model('NewMessage', MessageSchema);
    const NewReply = mongoose.model("NewReply", ReplySchema);


    module.exports = {NewMessage, NewReply};




