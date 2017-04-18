angular.module('proj.loja')

.service('LojaService', function ($http, $q){
    return {
		

		obterProdutosLoja: function () {

		    var d = $q.defer(),

			url = '/data.json'

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

