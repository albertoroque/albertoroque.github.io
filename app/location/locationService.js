angular.module('proj.location')

.service('LocationService', function ($http, $q) {
    return {
      
        decodeGoogleMapsAPI: function (latlong) {

            var d = $q.defer(),

			url = "//maps.googleapis.com/maps/api/geocode/json?latlng=" + latlong;

            delete $http.defaults.headers.common['Authorization'];

            $http.get(url)
              .success(function (result) {
                  d.resolve(result);
              })
              .error(function (result) {
                  d.reject(result);
              });

            return d.promise;

        },

        decodeAddressGoogleMapsAPI: function (address) {

            var d = $q.defer(),

            url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + address;

            delete $http.defaults.headers.common['Authorization'];

            console.log(url);
            
            $http.get(url)
              .success(function (result) {
                  d.resolve(result);
              })
              .error(function (result) {
                  d.reject(result);
              });

            return d.promise;

        },
        decodeCepAPI: function (cep) {

            var d = $q.defer(),
            url = "http://apps.widenet.com.br/busca-cep/api/cep/" + cep + ".json";

            delete $http.defaults.headers.common['Authorization'];
            
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

