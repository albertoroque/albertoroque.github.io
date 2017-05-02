angular.module('Proj',[
  	'ngRoute',    
    'ngMaterial',
    'ngCookies',
    'ngAnimate',
    'ngMessages',
    'proj.home',
    'proj.loja',
    'proj.buscar',
    'proj.erro',
    'proj.admloja'    
])

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

//---- REDIRECT INICIAL ------------
//-----------------------------------
.config([
  '$routeProvider', '$httpProvider',
  function($routeProvider, $httpProvider) {
          
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


.controller('CatalokoCtrl', function ($scope, $rootScope, $mdToast, $mdMedia, $location, $mdDialog, HomeService) {
    
    
    //----CONTROLE TOPO PÁGINA----------
    //-----------------------------------
    $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) { 
        $(".conteudo-principal").animate({ scrollTop: 0 }, 200); 
    });

    $rootScope.$mdMedia = $mdMedia;

    //------ VOLTAR PÁGINA---------------
    //-----------------------------------
    $rootScope.voltarPagina = function(){
        window.history.back();
    }


    //------VER PÁGINA DO PRODUTO ------
    //-----------------------------------
    $scope.verLoja = function () {
        window.open('#/loja', '_self');
    }

    //------VER PÁGINA DO PRODUTO ------
    //-----------------------------------
    $scope.verProduto = function () {
        window.open('#/produto', '_self');
    }
    

    //--------ABRIR MENU-----------------
    $scope.openMenu = function ($mdOpenMenu, ev) {        
        $mdOpenMenu(ev);
    };

    //-------- ESCONDE DIALOG -------
    $scope.hideDialog = function () {
        $mdDialog.hide();
    }

    //------------------------------------
    //OPEN APP PAGE
    //
    $rootScope.openPageApp = function(app){
                
        var facebook_appAndroid = "fb://page/1630215507273478";
        var facebook_appiOS = "fb://profile/1630215507273478";
        var facebook_url = "https://facebook.com/LAworldsports";
        var instagram_url = "http://instagram.com/_u/l.aworldsports/";
        var instagram_app = "instagram://user?username=l.aworldsports";
        var messenger_ = "http://m.me/LAworldsports";

        var os = {
            android: navigator.userAgent.match(/Android/i),
            ios:     navigator.userAgent.match(/iPhone|iPad|iPod/i)
        };
                
        //mobile
        if(os.android || os.ios) {
            if(app == 'instagram'){                
                window.open(instagram_app);
            }
            if(app == 'fb'){
                if(os.ios){
                    window.open(facebook_appiOS);    
                }                
                if(os.android){
                    window.open(facebook_appAndroid);    
                }                                
            }
            if (app == 'messenger') {
                window.open(messenger_, "_blank");
            }
        //desktop               
        }else{ 
            if(app == 'instagram'){                
                window.open(instagram_url);
            }
            if(app == 'fb'){                
                window.open(facebook_url);
            }
            if (app == 'messenger') {
                window.open(messenger_, "_blank");
            }
        }   

    }

    //------------------
    //TOAST
    //
    $rootScope.toast = function(conteudo) {
        var position = {
            bottom: true,
            top: false,
            left: true,
            right: false
        };
        $mdToast.show(
        $mdToast.simple()
            .content(conteudo)              
            .position(position)
            .hideDelay(3000)
        );
    };

    //-------------------------
    // CARREGA NOTÍCIA NA MODAL OU ABRE LINK
    //
  

    //
    // CAPTURA O ANO CORRENTE DO SERVIDOR E APRESENTA NO RODAPÉ
    //
    $scope.currentYear = (new Date).getFullYear();
      
})
  
.controller('MenuCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, $log) {
       

    $scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }
   
})





 
