'use strict';

var showdown = require('showdown');

function ShowdownService() {

  var options = {};
  var showdownConverter = new showdown.Converter(options);

  this.getConverter = function() {
    return showdownConverter;
  };

}

module.exports = ShowdownService;
