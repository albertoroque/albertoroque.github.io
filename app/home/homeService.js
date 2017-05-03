angular.module('proj.home')

.service('HomeService', function ($http, $q){
    return {

		TestarAuth: function(keypass){

		    var d = $q.defer(),

			url = 'http://localhost:37307/api/testauth';

			$http.defaults.headers.common['Authorization'] = keypass;

			$http.get(url)
			    .success(function(result){				
				    d.resolve(result);
			    })
			    .error(function(result){
				    d.reject(result);
			    });

			return d.promise;

		},

		decodeGoogleMapsAPI: function (latlong) {

		    var d = $q.defer(),

			url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlong;		    

		    $http.get(url)
			    .success(function (result) {
			        d.resolve(result);
			    })
			    .error(function (result) {
			        d.reject(result);
			    });

		    return d.promise;

		}
	}
})

