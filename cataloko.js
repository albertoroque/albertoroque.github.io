angular.module('Proj', [
  	'ngRoute',
    'ngMaterial',
    'ngCookies',
    'ngAnimate',
    'ngMessages',
    'ngMeta',
    'proj.home',
    'proj.cookie',
    'proj.loja',
    'proj.buscar',
    'proj.erro',
    'proj.admloja',
    'proj.location',
    'proj.image',
    'proj.shoppings',
    'proj.cliente'
])

.constant("ApiCK", "http://177.55.110.164:9058/api/")
//.constant("ApiCK", "http://localhost:37307/api/")
//.constant("ApiCK", "https://service.cataloko.com/api/")


//---- FB ID CONFIG ------------
//-----------------------------------
.config(function () {    
    if (window.location.hostname == "localhost") {
        window.FBid = "118554898795409";
        console.log('DEV');
    }else{
        window.FBid = "581702775331200";
        console.log('PROD');
    }

    
})


//-------- LOAGIN INICIAL ---------
//---------------------------------
.directive("mAppLoading", ['$animate',
    function ($animate) {
        return ({
            link: link,
            restrict: "C"
        });
        function link(scope, element, attributes) {
            $(element).fadeOut(1000);
        }    
    }
])


//-------- CONFIG TEMA--------------
//---------------------------------
.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('indigo');

})


//---- NG META CONFIG DEFAULTS ------
//-----------------------------------
.config(function(ngMetaProvider) { 
    ngMetaProvider.useTitleSuffix(true);
    ngMetaProvider.setDefaultTitle('Catáloko');
    ngMetaProvider.setDefaultTitleSuffix(' | Seu produto perto de você');
    ngMetaProvider.setDefaultTag('og:description', 'Encontre a sua skateshop favorita');
    ngMetaProvider.setDefaultTag('og:image', 'img/logoblue.png');
})


//---- REDIRECT INICIAL ------------
//-----------------------------------
.config([
  '$routeProvider', '$httpProvider', 'ngMetaProvider', '$locationProvider', 
    function ($routeProvider, $httpProvider, ngMetaProvider, $locationProvider) {
                                          
        //Possibilita remoção do hash # para definição de rotas, deve ser ativada no servidor        
        $locationProvider.html5Mode(true);

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
            
        $routeProvider
        .when('/', {
            redirectTo: '/home'
        })
        .otherwise({
            redirectTo: '/erro/404'
        });
  }
])


//---- NG META RUN INIT ------------
//-----------------------------------
.run(['ngMeta', function(ngMeta) { 
    ngMeta.init();
}])



// ------ VIRTUAL PAGES ------------
.run(function ($rootScope) { 
    $rootScope.$on("$routeChangeStart",function(event, next, current){
 
        if(next.templateUrl) {
            // interagindo com o Analytics através do objeto global ga
            ga('send', 'pageview', { page: next.templateUrl });
        }
    })
})


.controller('CatalokoCtrl', function ($scope, $rootScope, $q, $http, $window, $mdToast, $mdMedia, $location, $mdDialog, HomeService, ApiCK, ClienteAuthStore) {

    
    // CONTROLE TOPO PÁGINA ------------- 
    $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
        $(".conteudo-principal").animate({ scrollTop: 0 }, 200);
    });    
    
    // VOLTAR PÁGINA --------------    
    $rootScope.voltarPagina = function () {
        window.history.back();
    }
    
    // VER PÁGINA DO PRODUTO ------    
    $scope.verLoja = function (conta) {
        $location.path('/l/' + conta, '_self');
    }

    
    // VER PÁGINA DO PRODUTO ------ 
    $scope.verProduto = function (idproduto) {
        $location.path('/produto/' + idproduto, '_self');
    }

    
    // IR PARA PÁGINA-------------    
    $rootScope.irPara = function (page) {

        console.log(page);

        $location.path(page);
    }

    
    // IR PARA LOCALIZAÇÃO ------    
    $rootScope.irParaLocal = function (url) {
        $window.open(url, "_blank");
    }

    
    // IR PARA LINK EXTERNO ------    
    $rootScope.irParaLink = function (url) {

        console.log(url);

        window.location = url;
    }

    
    //====================================
    // VARIÁVEIS GLOBAIS DE CONTROLE
    //====================================


    // LOCALIZACAO
    $rootScope.LOCATION_ON = false;

    
    // CURRENT YEAR
    $scope.currentYear = (new Date).getFullYear();

    // SESSION
    $rootScope.SESSION_CLI = {};

    //
    $rootScope.SESSION_CLI_ON = isClienteLogado();
    
    
    
    //====================================
    // CONTROLE DE SESSÃO
    //====================================
        
    //
    $rootScope.isClienteLogado = function(){
        return isClienteLogado();
    }

    //
    function isClienteLogado(){
        
        var keypass = ClienteAuthStore.getKeypass();        

        if (keypass != null && keypass != 'undefined' && keypass != '') {
            $rootScope.SESSION_CLI_ON = true;
            $rootScope.SESSION_CLI = ClienteAuthStore.get();

            return true;
        } else {

            $rootScope.SESSION_CLI_ON = false;

            return false;
        }

        return false;
    }

   
        
    // ABRIR MENU-----------------
    $scope.openMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    // ESCONDE DIALOG -------
    $scope.hideDialog = function () {        
        $mdDialog.hide();
    }

    // ESCONDE DIALOG ON ROOT-------
    $rootScope.hideDialog = function () {        
        $mdDialog.hide();
    }

    // RECARREGA PÁGINA -----------
    $rootScope.recarregarPagina = function () {        
        window.location.reload();
    }

    // VERIFICA SE É DESKTOP -----------
    $rootScope.isDesktop = function(){
        
        var os = {
            android: navigator.userAgent.match(/Android/i),
            ios: navigator.userAgent.match(/iPhone|iPad|iPod/i)
        };

        if (!(os.android || os.ios)) {                
            var retorno = true;
        }else{
            var retorno = false;
        }
        
        return retorno;
    }

    
    // MOSTRA DIALOGO DO SHARELINK
    $scope.showShareLink = function(termo, tipo, ev){
            
        var baseUrl = ApiCK.replace("api/",""), url;
        
        if (tipo == "loja") {
            url = baseUrl + "loja/" + termo;
        } else if (tipo == "produto") {
            url = baseUrl + "produto/" + termo;
        } else {
            return false;
        }

        $rootScope.shareUrl = url;

        $scope.shareUrl = url;
       
        $mdDialog.show({
            controller: 'CatalokoCtrl',
            templateUrl: 'app/home/partials/shareLink.tpl.html',
            parent: angular.element(document.body),                        
            targetEvent: ev,
            scope: $rootScope,            
            preserveScope: true,            
            clickOutsideToClose: true
        })
        .then(function () {
           
        }, function () {
            
        });
                      
    }
    
    // OPEN APP PAGE   
    $scope.copyLink = function () {

        var inputShareLink = $("#" + "share-input");        
        
        inputShareLink.focus();
        inputShareLink.select();

        if (document.execCommand('copy')) {
            $rootScope.showToast('Link copiado');
        } else {
            $rootScope.showToast('Erro ao copiar link');
        }

        $scope.hideDialog();
    }
        
    // OPEN APP PAGE    
    $rootScope.openPageApp = function (app) {

        var facebook_appAndroid = "fb://page/1889413014636764";
        var facebook_appiOS = "fb://profile/1889413014636764";
        var facebook_url = "https://facebook.com/catalokooficial";
        var instagram_url = "http://instagram.com/_u/catalokooficial/";
        var instagram_app = "instagram://user?username=catalokooficial";
        var messenger_ = "http://m.me/catalokooficial";

        var os = {
            android: navigator.userAgent.match(/Android/i),
            ios: navigator.userAgent.match(/iPhone|iPad|iPod/i)
        };

        //mobile
        if (os.android || os.ios) {
            if (app == 'instagram') {
                window.open(instagram_app);
            }
            if (app == 'fb') {
                if (os.ios) {
                    window.open(facebook_appiOS);
                }
                if (os.android) {
                    window.open(facebook_appAndroid);
                }
            }
            if (app == 'messenger') {
                window.open(messenger_, "_blank");
            }
            //desktop               
        } else {
            if (app == 'instagram') {
                window.open(instagram_url);
            }
            if (app == 'fb') {                
                window.open(facebook_url);
            }
            if (app == 'messenger') {
                window.open(messenger_, "_blank");
            }
        }

    }
    
    // TOAST    
    $rootScope.showToast = function (conteudo) {        
        $mdToast.showSimple(conteudo);     
    }
    
    // RESOLVER COR LETRA   
    $rootScope.corLetra = function(letra){
      var nletra = letra.toUpperCase().charCodeAt(0);              
      var cor = '';          
          if (nletra <= 64)
              cor = '#aaa';
              
          if (nletra == 65 || nletra == 86 || nletra == 85)
              cor = '#2196F3';
              
          if (nletra == 67 || nletra == 68 || nletra == 66)
              cor = '#9C27B0';
              
          if (nletra == 69 || nletra == 70 || nletra == 87)
              cor = '#6200EA';
             
          if (nletra == 71 || nletra == 72 || nletra == 88)
              cor = '#673AB7';
             
          if (nletra == 73 || nletra == 74 || nletra == 89)
              cor = '#03A9F4';
              
          if (nletra == 75 || nletra == 76 || nletra == 90)
              cor = '#4CAF50';
              
          if (nletra == 77 || nletra == 78 || nletra == 91)
              cor = '#00BCD4';
              
          if (nletra == 79 || nletra == 80 || nletra == 93)
              cor = '#009688';
              
          if (nletra == 81 || nletra == 82 || nletra == 94)
              cor = '#8BC34A';
              
          if (nletra == 83 || nletra == 84 || nletra == 95)
              cor = '#888';

          if (nletra > 95)
              cor = '#333';          

        return cor;

    };         
    
    // DADOS DAS MARCAS (TEMPORÁRIO)
    $rootScope.resolverPrimeiraLetra= function(text) {

      var primeiraLetra = {};

      primeiraLetra.char = (text).toUpperCase().charAt(0);              
      primeiraLetra.cor = $scope.corLetra(primeiraLetra.char);
      
      return primeiraLetra;
    };
       

    // DADOS DAS MARCAS (TEMPORÁRIO)    
    $rootScope.getMarcas = function () {

        var marcas = [
            { "img": "img/marcas/dc.jpg", "titulo": "DC Shoes" },
            { "img": "img/marcas/adidas.jpg", "titulo": "Adidas" },
            { "img": "img/marcas/nike.jpg", "titulo": "Nike" },
            { "img": "img/marcas/vans.jpg", "titulo": "Vans" },
            { "img": "img/marcas/dgk.jpg", "titulo": "DGK" },
            { "img": "img/marcas/hocks.png", "titulo": "Hocks" },            
            { "img": "img/marcas/converse.jpg", "titulo": "Converse" },
            { "img": "img/marcas/diamond.jpg", "titulo": "Diamond" },
            { "img": "img/marcas/element.jpg", "titulo": "ELement" },
            { "img": "img/marcas/flip.jpg", "titulo": "Flip" },
            { "img": "img/marcas/grizzly.jpg", "titulo": "Grizzly" },
            { "img": "img/marcas/independent.jpg", "titulo": "Independent" },
            { "img": "img/marcas/ous.png", "titulo": "Ous" },
            { "img": "img/marcas/santacruz.jpg", "titulo": "Santa Cruz" },
            { "img": "img/marcas/spitfire.jpg", "titulo": "Spitfire" },
            { "img": "img/marcas/thrasher.jpg", "titulo": "Thrasher" },
            { "img": "img/marcas/volcom.jpg", "titulo": "Volcom" }
        ];

        return marcas;
    }

    // CAPTURA O WALLPAPER DA CIDADE    
    $rootScope.resolveCidadeWallpaper = function (cidade) {

        var wallpaper;

        if (cidade == "Guarulhos") {
            wallpaper = "img/shop/gru.jpg";
        }
        else if (cidade == "São Paulo") {
            wallpaper = "img/shop/sp.jpg";
        }
        else if (cidade == "Osasco") {
            wallpaper = "img/shop/osasco.jpg";
        } else {            
            wallpaper = "img/shop/default.jpeg";
        }

        return wallpaper;
    }   


    //====================================
    // NOTIFICAÇÃO CONTROLLER
    //====================================

    //
    //
    function notificationCrono() {

        if (window.notificationCrono != true) {

            if (isClienteLogado()) {
                updateNotification();
            }
            
            window.NOTIFICATION_ALERT = false;

            setInterval(function () {
                if (isClienteLogado()) {                    
                    updateNotification();
                }
            }, 60000);
        }

        window.notificationCrono = true;

        //
        //
        function updateNotification() {

            //se não existir notificação na tela
            if (!window.NOTIFICATION_ALERT) {

                verifyNotifications(ClienteAuthStore.getKeypass())
                .then(function (response) {
                    
                    if (response.verify) {                    
                        window.NOTIFICATION_ALERT = true;

                        //esconde notificação alerta após 3 seg
                        setTimeout(function () {                            
                            var notificationAlertMobile = $("#ck-mobile-navigation-notification-alert");
                            notificationAlertMobile.css("display", "none");                            
                        }, 5000);                        
                        
                    } else {                        
                        window.NOTIFICATION_ALERT = false;
                    }
                })
                .catch(function (response) {                    
                    window.NOTIFICATION_ALERT = false;                    
                })
            }            
        }

        //
        //
        function verifyNotifications(keypass) {

            var d = $q.defer();

            url = ApiCK + "cliente/" + keypass + "/notificacoes/verify";

            $http.get(url)
            .success(function (result) {
                d.resolve(result);
            })
            .error(function (result) {
                d.reject(result);
            });

            return d.promise;
        }
    
        //
        //
        $rootScope.turnOnNotification = function () {
            window.NOTIFICATION_ALERT = false;                                   
        }

        // FUNÇÃO VERIFICADORA DE ALERTA EXISTENTES
        //
        $rootScope.NOTIFICATION_ON = function () {            
            return window.NOTIFICATION_ALERT;
        }

    }

    //   
    // START NOTIFICATION CONTROL
    //
    notificationCrono();
    //
    //
})

.controller('MenuCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, $log) {

    $scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }

})












 
