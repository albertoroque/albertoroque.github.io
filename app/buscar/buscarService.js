angular.module('proj.buscar')

.service('BuscarService', function ($http, $q, ApiCK) {
    return {

        obterPesquisar: function (termo, dadosBusca) {

            var d = $q.defer(),

			 url = ApiCK + "produtos/buscar/" + termo;

            $http.post(url, dadosBusca)
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

