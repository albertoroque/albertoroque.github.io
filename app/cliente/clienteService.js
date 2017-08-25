angular.module('proj.cliente')

.service('ClienteService', function ($http, $q, ApiCK) {
    return {

        obterDadosFB: function () {

            var d = $q.defer();
			            
            var dados = {};

            FB.init({
                appId: window.FBid,
                cookie: true,
                xfbml: true,
                version: 'v2.8'
            })

            FB.getLoginStatus(function (response) {            
                          
                console.log(response);

                dados.statusFB = response.status;

                if (response.status === 'connected') {

                    console.log('FB -- CONECTADO');

                    dados.status = true;

                    FB.api('/me?fields=email,picture,name', function (dadosperfil) {
                        
                        dados.dadosperfil = dadosperfil;

                        d.resolve(dados);
                    })

                } else {
                                        
                    dados.status = false;

                    d.reject(dados);
                }                

                return d.promise;

            })

            return d.promise;
        },

        authClienteSocial: function(dadosPerfil){

            var d = $q.defer();     
                                    
            // public string nome { get; set; }            
            // public string email { get; set; }            
            // public string idsocial { get; set; }            
            // public string fotoperfil { get; set; }            
            // public string siglaredesocial { get; set; }

			url = ApiCK + "auth/social";		    		    
		    
		    $http.post(url, dadosPerfil)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

        },

        auth: function(keypass){

            var d = $q.defer();     
                                                          
			url = ApiCK + "cliente/" + keypass;		    		    
		    
		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;

        },


        checkSeguindoLoja: function (keypass, idloja) {

            var d = $q.defer();

            url = ApiCK + "cliente/" + keypass + "/loja/" + idloja + "/seguir/check";

            $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

            return d.promise;
        },


        checkinLoja: function (keypass, idloja) {

            var d = $q.defer();

            url = ApiCK + "cliente/" + keypass + "/loja/" + idloja + "/seguir";

            $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

            return d.promise;

        },

        checkoutLoja: function (keypass, idloja) {

            var d = $q.defer();

            url = ApiCK + "cliente/" + keypass + "/loja/" + idloja + "/seguir/checkout";

            $http.delete(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

            return d.promise;

        },

        obterLojasSeguidas: function (keypass) {

            var d = $q.defer();

            url = ApiCK + "cliente/" + keypass + "/lojas";

            $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

            return d.promise;

        },

        obterNotificacoes: function (keypass) {

            var d = $q.defer();

            url = ApiCK + "cliente/" + keypass + "/notificacoes";

            var valuecache = true ? true : false;
            
            $http.get(url, { cache: false })
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