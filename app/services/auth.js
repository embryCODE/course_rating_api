'use strict';

function AuthService(sessionService, validationService, dataService, $q) {
  var _this = this;

  _this.signIn = function(emailAddress, password) {
    var validationErrors = validationService.getValidationErrorsObject();

    // validate that we have an email address and password
    if (!emailAddress) {
      validationService.addRequiredValidationError(
        validationErrors, 'emailAddress', 'Please provide an email address.');
    }
    if (!password) {
      validationService.addRequiredValidationError(
        validationErrors, 'password', 'Please provide a password.');
    }

    // if we have validation errors, then short circuit this process
    if (validationService.hasValidationErrors(validationErrors)) {
      return validationService.prepareErrorResponse(validationErrors);
    }

    var currentUser = sessionService.currentUser;

    // set the email address and password on the current user
    // so that the data service has access to these values
    currentUser.emailAddress = emailAddress;
    currentUser.password = password;

    // attempt to get the user from the data service
    return dataService.getUser().then(
      function(response) {
        var user = response && response.data && response.data.data && response.data.data[0];

        currentUser.isAuthenticated = true;
        currentUser._id = user._id;
        currentUser.fullName = user.fullName;

        // return null to the caller indicating that there were no errors
        return $q.resolve(null);
      },
      function(response) {
        sessionService.resetSession();

        // add a validation indicating that the login failed
        validationService.addValidationError(
          validationErrors, 'password',
          validationService.validationCodes.loginFailure,
          'The login failed for the provided email address and password.');

        // return the validation errors to the caller
        return validationService.prepareErrorResponse(validationErrors);
      });
  }

  _this.signOut = function() {
    sessionService.resetSession();
  }
}

module.exports = AuthService;
