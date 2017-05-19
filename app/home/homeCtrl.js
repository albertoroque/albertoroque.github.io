angular.module('proj.home', [])

.config(function ($routeProvider, ngMetaProvider) {
    $routeProvider
        .when('/home', {
            controller: 'HomeCtrl',
            templateUrl: 'app/home/partials/home.tpl.html',            
        });
})


.controller('HomeCtrl', function ($scope, $rootScope, $location, $mdDialog, ngMeta, HomeService) {
           
    $scope.carregaHome = function(){
        ngMeta.setTitle('Catáloko', '| Home');
        ngMeta.setTag('og:image', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTHeCK18EjU8dQnKzYMt14-j2gfUYMA_oib8IJy3IMfu0GzPcy');
    }

    $scope.testarAuth = function () {

        $scope.keypassView = "";

        var keypass = "ASDASDASDASD";

        HomeService.TestarAuth(keypass)

            .then(function (data) {

                console.log(data);

                $scope.keypassView = data;
            })
            .catch(function () {

            })        
    }


    //-----------------------------------------
    //  SLIDER
    //-----------------------------------------

    $scope.loadSlider = function (firstImage) {        
        $scope.sliderImage = firstImage;
        $scope.sliderIndex = 1;

        var sliderGroupBtn = '.slider-control-btn';

        var sliderIndexTotal = $(sliderGroupBtn).length;

        $($(sliderGroupBtn)[0]).css("background-color", "#444");


        // CHANGE ON CONTROLE
        $scope.sliderChange = function (event, indexBtn) {            
            $(sliderGroupBtn).css("background-color", "rgba(84, 84, 84, 0.6)");
            $scope.sliderImage = event.target.attributes.dataimage.value;                        
            $(event.target).css("background-color", "#444");
            $scope.sliderIndex = indexBtn;

            console.log($scope.sliderIndex);
        }

        // CHANGE ON CONTROLE
        $scope.nextSlide = function () {
            $scope.sliderIndex++;
            if (sliderIndexTotal < $scope.sliderIndex) {
                $scope.sliderIndex = 1;
            }                        
            changeSliderByIndex($scope.sliderIndex);
        }

        $scope.prevSlide = function () {
            $scope.sliderIndex--;


            if ($scope.sliderIndex < 1) {
                $scope.sliderIndex = sliderIndexTotal;
            }

            console.log($scope.sliderIndex);

            changeSliderByIndex($scope.sliderIndex);
        }

        function changeSliderByIndex(index) {
            var classNextBtn = ".slideIndex" + index;
            $(sliderGroupBtn).css("background-color", "rgba(84, 84, 84, 0.6)");
            $scope.sliderImage = $(classNextBtn).attr("dataimage");
            $(classNextBtn).css("background-color", "#444");

        }
    }

    
    


   
});