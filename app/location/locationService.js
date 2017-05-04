angular.module('proj.location')

.service('LocationService', function ($http, $q) {
    return {
      
        decodeGoogleMapsAPI: function (latlong) {

            var d = $q.defer(),

			url = '//maps.googleapis.com/maps/api/geocode/json?latlng=' + latlong;

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

