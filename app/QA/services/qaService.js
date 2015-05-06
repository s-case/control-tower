angular.module('qaService', [])
	// super simple service
	// each function returns a promise object 
	.factory('qaFactory', function($http) {
		return {
			get : function() {
				return $http.get('/api/qa');
			}
		}
	});