angular.module('proj.admloja')

.service('AdmLojaService', function ($http, $q, ApiCK, AuthStore) {
    
    return {

        //-------------------------------------------------------------
        // SERVICE -> AUTH
        //-------------------------------------------------------------

        auth: function(entrarData){
            var d = $q.defer(),

           url = ApiCK + "auth";

            $http.post(url, entrarData)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

            return d.promise;
        },       

        obterDadosLoja: function (idloja) {

            var d = $q.defer(),
			url = ApiCK + "adm/loja/" + idloja;
            
            $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

            $http.get(url)           
			.success(function (result) {			    
			    d.resolve(result);
                
			})
			.error(function (error) {			    
			    d.reject(error);
			});

            return d.promise;

        },

        //-------------------------------------------------------------
        // SERVICE -> PRODUTOS LOJA
        //-------------------------------------------------------------

		obterProdutosLoja: function (idloja) {

		    var d = $q.defer(),
			url = ApiCK + "adm/loja/" + idloja + "/produtos";
		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		obterProdutosLojaPorCategoria: function (idloja, idcategoria) {

		    var d = $q.defer(),
			url = ApiCK + "adm/loja/" + idloja + "/produtos/categoria/" + idcategoria;
		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		obterProduto: function (idproduto) {

		    var d = $q.defer(),
			url = ApiCK + "adm/produto/" + idproduto;
		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			}); 

		    return d.promise;

		},


        //-------------------------------------------------------------
        // SERVICE -> CADASTRO LOJA
        //-------------------------------------------------------------

		cadastrarLoja: function (dadosLoja) {

		    var d = $q.defer(),

			url = ApiCK + "loja";

		    $http.post(url, dadosLoja)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		editarLoja: function (idloja, dadosLoja) {

		    var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja;

		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    $http.put(url, dadosLoja)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		editarLojaLocalizacao: function (idloja, dadosLocal) {

		    var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja + "/localizacao";

		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    console.log(dadosLocal);

		    $http.put(url, dadosLocal)
			.success(function (result) {
			    d.resolve(result); 
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},


        //-------------------------------------------------------------
        // SERVICE -> SETOR
        //-------------------------------------------------------------

		obterSetores: function (dadosLoja) {

		    var d = $q.defer(),

			 url = ApiCK + "setores";

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		salvarSetor: function (idloja, idsetor) {

		    var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja + "/setor/" + idsetor;

		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    $http.patch(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

        //-------------------------------------------------------------
        // SERVICE -> FOTOPERFIL
        //-------------------------------------------------------------

		salvarFotoPerfilLoja: function (idloja, dadosFoto) {

		    var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja + "/fotoperfil";

		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    $http.patch(url, dadosFoto)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},


        //-------------------------------------------------------------
        // SERVICE -> CATEGORIA
        //-------------------------------------------------------------

		salvarCategoria: function (idloja, dadosCategoria) {

		    var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja + "/categoria";

		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    $http.post(url, dadosCategoria)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		obterCategorias: function (idloja) {

		    var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja + "/categoria";
            
		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		obterCategorias: function (idloja) {

		    var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja + "/categoria";

		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		obterTodasCategorias: function (idloja) {

		    var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja + "/categoria/todas";

		    $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		editarCategoria: function (idloja, dadosCategoria) {

		    var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja + "/categoria";

		    $http.put(url, dadosCategoria)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

		},

		desativarCategoria: function (idloja, idcategoria) {

		    var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja + "/categoria";

		    $http.delete(url)
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

.service('AdmProdutoService', function ($http, $q, ApiCK, AuthStore) {
    return {

        salvarProduto: function (idloja, dadosProduto) {

            var d = $q.defer(),

			url = ApiCK + "adm/loja/" + idloja + "/produto";

            $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

            $http.post(url, dadosProduto)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

            return d.promise;

        },

        salvarEdicaoProduto: function (idproduto, dadosProduto) {

            var d = $q.defer(),

			url = ApiCK + "adm/produto/" + idproduto;

            $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

            $http.put(url, dadosProduto)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

            return d.promise;

        },

        salvarMidiaProduto: function (idproduto, dadosMedia) {

            var d = $q.defer(),

			url = ApiCK + "adm/produto/" + idproduto + "/media/add";

            $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

            $http.post(url, dadosMedia)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

            return d.promise;

        },

        excluirMidiaProduto: function (idproduto, idmedia) {

            var d = $q.defer(),

			url = ApiCK + "adm/produto/" + idproduto + "/media/" + idmedia;

            $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

            $http.delete(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

            return d.promise;

        },

        desativarProduto: function (idproduto) {

            var d = $q.defer(),

			url = ApiCK + "adm/produto/" + idproduto;

            $http.defaults.headers.common['Authorization'] = AuthStore.getKeypass();

            $http.delete(url)
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

