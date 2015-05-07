angular.module('qaControllerModule', [])

	// inject the Todo service factory into our controller
	.controller('qaController', function($scope, $http, qaFactory) {
		$scope.formData = {};

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		qaFactory.get()
			.success(function(data) {
				$scope.todos = data;
			});
	});