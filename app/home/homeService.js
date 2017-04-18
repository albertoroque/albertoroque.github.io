angular.module('proj.home')

.service('HomeService', function ($http, $q){
    return {

		obterHomeModalidade: function(){

			var d = $q.defer(),
			
			url = '/modalidades/modalidadeshome.json'

			$http.get(url)
			.success(function(result){				
				d.resolve(result);
			})
			.error(function(result){
				d.reject(result);
			});

			return d.promise;

		},

		carregaNoticias: function (language) {

		    var d = $q.defer(),

			url = '/news/locale/'+ language + '/news.json'

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		obterIdioma: function (lang) {

		    var d = $q.defer(),

			url = '/locale/' + lang + '/data.json';		    

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

