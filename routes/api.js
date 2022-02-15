'use strict';

const { NewMessage, NewReply } = require("../models");


module.exports = function (app) {
  
  app.route('/api/threads/:board')

    .post(function (request, response) {
      
    })
    
  app.route('/api/replies/:board')

    .post(function (request, response) {

    })
};
