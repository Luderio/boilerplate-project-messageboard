const mongodb = require('mongodb');
const mongoose = require('mongoose');

//DATABASE SETUP
const databaseURI = process.env['DB'];
const database = mongoose.connect(databaseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = database;