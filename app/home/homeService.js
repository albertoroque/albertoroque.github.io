angular.module('proj.home')

.service('HomeService', function ($http, $q, ApiCK){
    return {

		
		obterTop10: function () {

		    var d = $q.defer(),

			url = ApiCK + "lojas/home/top10";		    

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

