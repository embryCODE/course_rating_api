'use strict';

function SignUpController(authService, dataService, errorHandlerService, $location, $log) {

  var _this = this;

  _this.fullName = '';
  _this.emailAddress = '';
  _this.password = '';
  _this.confirmPassword = '';
  _this.validationErrors = {};
  _this.hasValidationErrors = false;

  _this.signUp = function() {
    var user = {
      fullName: _this.fullName,
      emailAddress: _this.emailAddress,
      password: _this.password,
      confirmPassword: _this.confirmPassword
    };

    dataService.createUser(user).then(
      function() {
        authService.signIn(user.emailAddress, user.password).then(
          function() {
            $location.path('/');
          },
          function(response) {
            errorHandlerService.handleError(response, displayValidationErrors);
          });
      },
      function(response) {
        errorHandlerService.handleError(response, displayValidationErrors);
      });
  };

  function displayValidationErrors(validationErrors) {
    _this.validationErrors = validationErrors.errors;
    _this.hasValidationErrors = true;
  }

  function resetValidationErrors() {
    _this.validationErrors = {};
    _this.hasValidationErrors = false;
  }

}

module.exports = SignUpController;
