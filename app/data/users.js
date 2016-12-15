'use strict';

var _ = require('underscore');

function UsersData(sessionService, validationService, $q) {

  var usersData = {
    data: [
      {
        _id: 1,
        fullName: 'Joe Smith',
        emailAddress: 'joe@smith.com',
        password: 'password'
      },
      {
        _id: 2,
        fullName: 'Sam Jones',
        emailAddress: 'sam@jones.com',
        password: 'password'
      },
      {
        _id: 3,
        fullName: 'Sam Smith',
        emailAddress: 'sam@smith.com',
        password: 'password'
      }
    ]
  };

  // the actual api service can only retrieve the user data for the current user
  // so we model that behavior here by only supporting getting the user that
  // matches the current user's email address and password
  this.getUser = function() {
    var currentUser = sessionService.currentUser;
    var user = findUser(currentUser.emailAddress, currentUser.password);
    var returnValue = null;

    if (user) {
      returnValue = { data: [ user ] };
      return prepareContent(returnValue);
    } else {
      return $q.reject({ data: null, status: 404 });
    }
  };

  this.createUser = function(user) {
    var validationErrors = validationService.getValidationErrorsObject();

    // validate the user
    if (!user.fullName) {
      validationService.addRequiredValidationError(
        validationErrors, 'fullName', 'Please provide a full name.');
    }
    if (!user.emailAddress) {
      validationService.addRequiredValidationError(
        validationErrors, 'emailAddress', 'Please provide an email address.');
    }
    if (!user.password) {
      validationService.addRequiredValidationError(
        validationErrors, 'password', 'Please provide a password.');
    }
    if (!user.confirmPassword) {
      validationService.addRequiredValidationError(
        validationErrors, 'confirmPassword', 'Please confirm your password.');
    }
    if (user.password !== user.confirmPassword) {
      validationService.addValidationError(
        validationErrors, 'password', validationService.validationCodes.passwordMismatch,
        'Your password and password confirmation do not match.');
    }

    // check for existing user
    var existingUser = findUserByEmailAddress(user.emailAddress);
    if (existingUser) {
      validationService.addValidationError(
        validationErrors, 'emailAddress', validationService.validationCodes.existingUser,
        'We found an existing user for the provided email address. Please sign in using that email address or provide a different email address.');
    }

    // if we have validation errors, then short circuit this process
    if (validationService.hasValidationErrors(validationErrors)) {
      return validationService.prepareErrorResponse(validationErrors);
    }

    // determine and set the user id
    user._id = usersData.data.length + 1;

    // add the user
    usersData.data.push(user);
    
    // return an empty promise
    return prepareContent();
  };

  function prepareContent(data) {
    var content = null;
    if (data) {
      content = { data: data };
    }
    
    return $q.resolve(content);
  }

  function findUser(emailAddress, password) {
    var user = _.find(usersData.data, function(user) {
      // for now, let's allow for a case insensitive match on email address
      // and a case sensitive match on password
      return (
        user.emailAddress.toLowerCase() === emailAddress.toLowerCase() &&
        user.password === password);
    });
    return user;
  }

  function findUserByEmailAddress(emailAddress) {
    var user = _.find(usersData.data, function(user) {
      // for now, let's allow for a case insensitive match on email address
      return user.emailAddress.toLowerCase() === emailAddress.toLowerCase();
    });
    return user;
  }

}

module.exports = UsersData;
