angular.module('proj.loja')

.service('LojaService', function ($http, $q, ApiCK) {
    return {
		

		obterProdutosLoja: function () {

		    var d = $q.defer(),

			 url = ApiCK + "auth";

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;
		},

		obterLojasPorNome: function (termo) {

		    var d = $q.defer(),

			 url = ApiCK + "lojas/buscar/" + termo;

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;
		},

		obterLoja: function (conta) {

		    var d = $q.defer(),

			 url = ApiCK + "lojas/" + conta;

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;
		},

		obterLojaPorId: function (idloja) {

		    var d = $q.defer(),

			 url = ApiCK + "lojas/" + idloja;

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

			 url = ApiCK + "produtos/" + idproduto;

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;
		},

		obterProdutosPorCategoria: function (idloja, idcategoria) {

		    var d = $q.defer(),

			 url = ApiCK + "lojas/" + idloja + "/categoria/" + idcategoria + "/produtos";

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;
		},

		obterLojasPorGeo: function (dadosBusca) {

		    var d = $q.defer(),

			url = ApiCK + "lojas/buscar";

		    $http.post(url, dadosBusca)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;
		},

		obterSetores: function () {

		    var d = $q.defer(),

			url = ApiCK + "lojas/setores";

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;
		},

		lojaCountVs: function (idloja) {

		    var d = $q.defer(),

			url = ApiCK + "lojas/" + idloja + "/vs";

		    $http.get(url)
			.success(function (result) {
			    d.resolve(result);
			})
			.error(function (result) {
			    d.reject(result);
			});

		    return d.promise;
		},



	}
})

.service('anchorSmoothScroll', function(){
    
    this.scrollTo = function(eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };
    
});

