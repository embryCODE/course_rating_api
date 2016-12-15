'use strict';

function SignInController(authService, errorHandlerService, $location, $log) {

  var _this = this;

  _this.emailAddress = '';
  _this.password = '';
  _this.validationErrors = {};
  _this.hasValidationErrors = false;

  _this.signIn = function() {
    authService.signIn(_this.emailAddress, _this.password).then(
      function() {
        $location.path('/');
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

module.exports = SignInController;
