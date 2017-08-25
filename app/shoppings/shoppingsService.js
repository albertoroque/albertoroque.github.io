angular.module('proj.shoppings')

.service('ShoppingsService', function ($http, $q, ApiCK){
    return {

		
		obterLocaisPorCidade: function (cidade) {

		    var d = $q.defer(),

			url = ApiCK + "locais/" + cidade;		    
		    		    
		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		obterLocalPorId: function(idlocal){
			 var d = $q.defer(),

			url = ApiCK + "locais/" + idlocal;		    
		    		    
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

