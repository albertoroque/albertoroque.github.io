
angular.module('proj.location', [])

.controller('LocationCtrl', function ($scope, $rootScope, $location, $filter, $mdDialog, LocationService, AuthSearch) {        
  
    //-----------------------------------
    //  GEODECODER
    //-----------------------------------

    
    //
    //
    $rootScope.updateLocation = function () {
        
        $scope.cidadesDispo = ['Guarulhos', 'São Paulo', 'Osasco'];

        $mdDialog.show({
            controller: 'LocationCtrl',
            templateUrl: 'app/location/partials/locationDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,                
            clickOutsideToClose: true
        })
        .then(function () {

        });
                       

        //loadAllCities(result);
        
    }

    // Salva dados de geolocalização para pesquisa do usuário
    //
    $scope.saveLocation = function (geodata) {
        AuthSearch.setGeo(geodata);        
        $scope.hideDialog();
        $rootScope.LOCATION_ON = true;
    }

    // Salva somente cidade para pesquisa de localização
    //
    $scope.saveLocationCity = function (cidade) {
        AuthSearch.clear();        
        var geodata = {};
        //geodata.cidade = cidade.display;

        geodata.cidade = cidade;
        AuthSearch.setGeo(geodata);        
        $scope.hideDialog();
        $rootScope.LOCATION_ON = true;
    }

    //----------------------------
    //AUTOCOMPLETE
    //----------------------------

    //
    //
    $scope.querySearch = function (query) {                
        return query ? createFilterFor(query) : $scope.cidadesDisponiveis;
    }

    //
    //
    function createFilterFor(query) {
        
        var lowercaseQuery = angular.lowercase(query);        
        
        var result = $filter('filter')($scope.cidadesDisponiveis, lowercaseQuery);
        
        return result;
    }

    // Carrega todas as cidades disponíveis no sistema
    //
    function loadAllCities(cidades) {
       
        var result = cidades.map(function (cidade) {
            return {
                value: cidade.toLowerCase(),
                display: cidade
            };
        });

        $scope.cidadesDisponiveis = result;        
    }

    // --------------------------
    // GPS SEARCH
    // --------------------------

    //
    //
    $scope.getPermissionLocation = function() {
        
        if (navigator.geolocation) {                        
            navigator.geolocation.getCurrentPosition(getLatLong, showError, { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 });            
            $scope.location = {};            
        } else {
            $scope.localizationDialogPage = 4;            
        }
    }

    //
    //
    function getLatLong(position) {

        var latlong = position.coords.latitude + ',' + position.coords.longitude;
                
        LocationService.decodeGoogleMapsAPI(latlong)
        .then(function (data) {           
            if (data.status == "OK") {
                if (data.results[0]) {
                
                    $scope.location.cidade = extractFromAddress(data.results[0].address_components, "locality", null);
                    if ($scope.location.cidade == null) {
                        $scope.location.cidade = extractFromAddress(data.results[0].address_components, "administrative_area_level_2", null);
                    }

                    $scope.location.bairro = extractFromAddress(data.results[0].address_components, "sublocality_level_1", null);
                    $scope.location.estado = extractFromAddress(data.results[0].address_components, "administrative_area_level_1", "short_name");
                    $scope.location.pais = extractFromAddress(data.results[0].address_components, "country", null);

                    if (data.results[0].geometry.bounds != null) {
                        $scope.location.latitude = data.results[0].geometry.bounds.northeast.lat;
                        $scope.location.longitude = data.results[0].geometry.bounds.northeast.lng;
                    }
                    if (data.results[0].geometry.location != null) {
                        $scope.location.latitude = data.results[0].geometry.location.lat;
                        $scope.location.longitude = data.results[0].geometry.location.lng;
                    }

                    $scope.localizationDialogPage = 3;
                }
            } else {

                $scope.localizationDialogPage = 4;                
            }
        })

        .catch(function (err) {
            $scope.localizationDialogPage = 4;
        })
    }

    //
    //
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log(error, 'PERMI DENIED');
                $scope.locationMsgError = "Permissão negada. Por favor, atualize o site e ative seu GPS. Se possível limpe o histórico do navegador.";
                $scope.localizationDialogPage = 4;                
                break;
            case error.POSITION_UNAVAILABLE:
                console.log(error, 'UNAVAILABLE');
                $scope.locationMsgError = "Por favor, atualize o site e ative seu GPS.";
                $scope.localizationDialogPage = 4;
                break;
            case error.TIMEOUT:
                console.log(error, 'TIME OUT');
                $scope.locationMsgError = "Acho que a resposta do GPS demorou um pouco, tente de novo!";
                $scope.localizationDialogPage = 4;
                break;
            case error.UNKNOWN_ERROR:
                console.log(error, 'UNNKOW ERROR');
                $scope.locationMsgError = "Aconteceu algum erro desconhecido. Vamos cuidar disso em breve!";
                $scope.localizationDialogPage = 4;
                break;
        }
    }


    //Extrai determinada parte do endereço completo.
    //
    function extractFromAddress(components, type, typename) {
        for (var i = 0; i < components.length; i++)
            for (var j = 0; j < components[i].types.length; j++)
                if (components[i].types[j] == type) {
                    if (typename == "short_name") {
                        return components[i].short_name;
                    } else {
                        return components[i].long_name;
                    }                    
                }
                    
        return "";
    }   
})
