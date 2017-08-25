angular.module('proj.home', [])

.config(function ($routeProvider, ngMetaProvider) {
    $routeProvider
        .when('/home', {
            controller: 'HomeCtrl',
            templateUrl: 'app/home/partials/home.tpl.html',            
        })
        .when('/mais', {
            controller: 'HomeCtrl',
            templateUrl: 'app/home/partials/mais.tpl.html',
        });
})


.controller('HomeCtrl', function ($scope, $rootScope, $location, $mdDialog, $mdMedia, ngMeta, HomeService) {
    
    //
    //
    $scope.carregaHome = function () {
        $scope.$mdMedia = $mdMedia;                
        $scope.carregaTop10();
        $scope.carregaMarcas();        
    }

    //
    //
    $scope.carregaMarcas = function(){
        var marcas = $rootScope.getMarcas();
        $scope.marcas = [];
        for (var i = 0; i < 6; i++) {            
            $scope.marcas.push(marcas[i]);
        }        
    }

    //
    //
    $scope.showTodasMarcas = function () {
        $scope.marcas = $rootScope.getMarcas();
    }


    //
    //
    $scope.carregaTop10 = function () {

        $scope.top10 = {};        

        HomeService.obterTop10()
        .then(function (data) {            
            $scope.top10 = data;
        })
        .catch(function (data) {
            
        })
    }
     
        
    //-----------------------------------------
    //  SLIDER
    //-----------------------------------------

    $scope.loadSlider = function (firstImage) {        

        $scope.sliderImage = firstImage;

        $scope.sliderIndex = 1;

        $scope.sliderCounter = 0;

        var sliderGroupBtn = '.slider-control-btn';

        var sliderIndexTotal = $(sliderGroupBtn).length;

        $($(sliderGroupBtn)[0]).css("background-color", "#444");

        // CHANGE ON CONTROLE
        //
        $scope.sliderChange = function (event, indexBtn) {            
            $(sliderGroupBtn).css("background-color", "rgba(84, 84, 84, 0.6)");
            $scope.sliderImage = event.target.attributes.dataimage.value;                        
            $(event.target).css("background-color", "#444");
            $scope.sliderIndex = indexBtn;
            $scope.sliderCounter = 0;
        }        

        // CHANGE ON CONTROLE
        //
        $scope.nextSlide = function () {
            
            $scope.sliderIndex++;
            if (sliderIndexTotal < $scope.sliderIndex) {
                $scope.sliderIndex = 1;
            }

            changeSliderByIndex($scope.sliderIndex);
        }

        // VAI PARA UM LINK COM CLIQUE NO SLIDE
        //
        $scope.sliderClick = function (event) {            
            if (event.target.id == "slider") {

                var classNextBtn = ".slideIndex" + $scope.sliderIndex;;
                var link = $(classNextBtn).attr("datahref");             
                if (link.indexOf("http") > -1) {             
                    $rootScope.irParaLocal(link);
                } else {             
                    $rootScope.irPara(link);
                }
            }
        }

        // VOLTA UM SLIDE
        //
        $scope.prevSlide = function () {
            $scope.sliderIndex--;

            if ($scope.sliderIndex < 1) {
                $scope.sliderIndex = sliderIndexTotal;
            }            
            changeSliderByIndex($scope.sliderIndex);
        }

        // MUDA SLIDER POR INDEX
        //
        function changeSliderByIndex(index) {
            
            var classNextBtn = ".slideIndex" + index;

            $(sliderGroupBtn).css("background-color", "rgba(84, 84, 84, 0.6)");
            $scope.sliderImage = $(classNextBtn).attr("dataimage");
            $(classNextBtn).css("background-color", "#444");

            $scope.$apply();


        }

        cronometro();

        function cronometro() {
            
            var timer = setInterval(function () {
                if ($scope.sliderCounter >= 2) {
                    $scope.nextSlide();
                    $scope.sliderCounter = 0;
                }
                $scope.sliderCounter++;
            }, 2500);
        }
    }


    //-----------------------------------------
    //  MAIS
    //-----------------------------------------
           
})

.controller('TutorialLojaCtrl', function ($scope, $rootScope, $location, $mdDialog, $mdMedia) {


    $scope.carregaTutorialCadastroLoja = function (ev) {


        $scope.tutoPosition = 1;
        $scope.totalQuadros = 5;

        $mdDialog.show({
            controller: 'TutorialLojaCtrl',
            templateUrl: 'app/home/partials/tutorial/tutoLojaCadastroDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            targetEvent: ev,
            fullscreen: true,
            preserveScope: true,
            clickOutsideToClose: true
        })
         .then(function () {

         });

        $scope.tutoVoltar = function () {
            if ($scope.tutoPosition > 1) {
                $scope.tutoPosition = $scope.tutoPosition - 1;
            } 
        }


        $scope.tutoProximo = function () {
            if ($scope.tutoPosition < $scope.totalQuadros) {
                $scope.tutoPosition = $scope.tutoPosition + 1;
            }
        }
    }

})