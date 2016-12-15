'use strict';

function Rating() {
  var controller = ['$scope', function($scope) {

    $scope.$watch('value', function(newValue, oldValue) {
      var valueAsNumber = 0;
      if (newValue) {
        valueAsNumber = parseInt(newValue);
      }
      $scope.valueAsNumber = valueAsNumber;
    });

    $scope.setRating = function(value) {
      if ($scope.allowEdit) {
        $scope.value = value;
      }
    };
  }];

  return {
    restrict: 'E',
    scope: {
      value: '=',
      isUserRating: '@',
      allowEdit: '@'
    },
    controller: controller,
    templateUrl: 'templates/rating.html'
  }
}

module.exports = Rating;
