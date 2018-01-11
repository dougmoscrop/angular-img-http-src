(function () {
	'use strict';
	/*global angular, Blob, URL */

	angular.module('angular.img', [
	]).directive('httpSrc', ['$http', function ($http) {
		return {
            scope: {
                defaultImgSrc: '@'
            },
			link: function ($scope, elem, attrs) {
				function revokeObjectURL() {
					if ($scope.objectURL) {
						URL.revokeObjectURL($scope.objectURL);
					}
				}

				$scope.$watch('objectURL', function (objectURL) {
					elem.attr('src', objectURL);
				});

				$scope.$on('$destroy', function () {
					revokeObjectURL();
				});

				attrs.$observe('httpSrc', function (url) {
					revokeObjectURL();

					if(url && url.indexOf('data:') === 0) {
						$scope.objectURL = url;
					} else if(url) {
						$http.get(url, { responseType: 'arraybuffer' }).then(
							function(response) {
								if (response.headers('Content-Type').match(/image/g)) {
									var blob = new Blob(
										[ response.data ],
										{ type: response.headers('Content-Type') }
									);
									$scope.objectURL = URL.createObjectURL(blob);
								} else {
									$scope.objectURL = $scope.defaultImgSrc;
								}
							},
							function(data) {
								// Handle error here
								$scope.objectURL = $scope.defaultImgSrc;
							}
						)
					}
				});
			}
		};
	}]);
}());
