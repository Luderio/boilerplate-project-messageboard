'use strict';

const Model = require('../models').NewMessage;

module.exports = function (app) {
  
  app.route('/api/threads/:board');
    
  app.route('/api/replies/:board');

};
