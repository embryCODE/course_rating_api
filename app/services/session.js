'use strict';

function Session() {
  var _this = this;

  _this.currentUser = {};

  _this.resetSession = function() {
    _this.currentUser = {
      isAuthenticated: false,
      _id: 0,
      fullName: '',
      emailAddress: '',
      password: ''
    };
  };

  init();

  function init() {
    _this.resetSession();
  }
}

module.exports = Session;
