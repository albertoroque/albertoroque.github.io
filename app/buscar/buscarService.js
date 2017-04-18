angular.module('proj.buscar')

.service('BuscarService', function ($http, $q){
    return {

        obterPesquisar: function (termo) {

			var d = $q.defer(),
			
			url = '/data.json'

			$http.get(url)
			.success(function(result){				
				d.resolve(result);
			})
			.error(function(result){
				d.reject(result);
			});

			return d.promise;

		}

	}
})

