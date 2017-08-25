
angular.module('proj.cookie', [])


.controller('CookieCtrl', function ($scope, $location) {

})



//---- CLIENTE COOKIE ------------
//-----------------------------------

.factory("ClienteAuthStore", [
    "$cookies", function ($cookies) {
        var cliente = {};
        return {
            set: function (cliente) {
                var now = new Date(), exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
                cliente = cliente;
                //$cookies.put("cliente", cliente, { expires: exp });
                $cookies.putObject("cliente", cliente);
            },
            get: function () {
                cliente = $cookies.getObject("cliente");
                return cliente;
            },
            getKeypass: function () {

                cliente = $cookies.getObject("cliente");

                if (cliente) {
                    return cliente.keypass;
                }
                return null;
            },
            clear: function () {
                cliente = {};
                cliente.isLogado = false;
                $cookies.remove("cliente");
            }
        }
    }
])

//---- AUTH STORE CONTROLE DE SESSAO ------------
//-----------------------------------------------
.factory("AuthStore", [
  "$cookieStore", function ($cookieStore) {
      var conta = {};
      return {
          set: function (conta) {
              conta = conta;
              $cookieStore.put("conta", conta);
          },
          get: function () {
              conta = $cookieStore.get("conta");
              return conta;
          },
          getKeypass: function () {
              conta = $cookieStore.get("conta");
              return conta.keypass;
          },
          clear: function () {
              conta = {};
              conta.isLogado = false;
              $cookieStore.remove("conta");
          }
      }
  }
])



//---- AUTH SEARCH -----------------------------
//-----------------------------------------------
.factory("AuthSearch", [
  "$cookieStore", function ($cookieStore) {
      var geodata = {};
      return {
          setGeo: function (geodata) {
              geodata.latitude == null ? geodata.latitude = 0 : '';
              geodata.longitude == null ? geodata.longitude = 0 : '';
              geodata.raiokm == null ? geodata.raiokm = 2 : '';
              geodata = geodata;
              $cookieStore.put("geodata", geodata);
          },
          getGeo: function () {
              geodata = $cookieStore.get("geodata");
              return geodata;
          },
          clear: function () {
              geodata = {};
              $cookieStore.remove("geodata");
          }
      }
  }
])

//---- AUTH SEARCH -----------------------------
//-----------------------------------------------
.factory("UserStore", [
  "$cookieStore", function ($cookieStore) {
      var userstore = {};
      return {
          setBuscaRecente: function (termo) {
              userstore = $cookieStore.get("userstore");
              if (userstore == null || userstore == undefined) {
                  userstore = {};
              }
              if (userstore.buscasRecentes == null || userstore.buscasRecentes == undefined) {
                  userstore.buscasRecentes = [];
              }
              var buscasRecentes = userstore.buscasRecentes;
              var s = buscasRecentes.indexOf(termo);
              if (s < 0) {
                  buscasRecentes.push(termo);
              }
              userstore.buscasRecentes = buscasRecentes;
              $cookieStore.put("userstore", userstore);
          },
          getBuscaRecente: function () {
              userstore = $cookieStore.get("userstore");
              if (userstore != null && userstore.buscasRecentes != null) {
                  var contador = userstore.buscasRecentes.length - 1;
                  var retornoBuscasRecentes = [];
                  var stop;
                  contador >= 4 ? stop = contador - 5 : stop = 0;
                  for (var i = contador; i >= stop; i--) {
                      retornoBuscasRecentes.push(userstore.buscasRecentes[i]);
                  }
                  return retornoBuscasRecentes;
              } else {
                  return null;
              }
          },
          setLojaVs: function (idloja) {
              userstore = $cookieStore.get("userstore");

              var lojaVsVerificador = false;

              if (userstore == null || userstore == undefined) {
                  userstore = {};
              }

              if (userstore.lojasvs == null || userstore.lojasvs == undefined) {
                  userstore.lojasvs = [];
              }

              var s = userstore.lojasvs.indexOf(idloja);
              if (s < 0) {
                  userstore.lojasvs.push(idloja);
                  lojaVsVerificador = true;
              }

              $cookieStore.put("userstore", userstore);

              return lojaVsVerificador;
          },
          clearAll: function () {
              geodata = {};
              $cookieStore.remove("userstores");
          }
      }
  }
])