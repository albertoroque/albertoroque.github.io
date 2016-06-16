/* fade in logo */
$(document).ready(function(){
	$("#fodase,#letreiro").hide();
	$("#fodase,#letreiro").fadeTo(5000, 1.0);
});

/*--------------------Ancoragem--------------------*/
$(document).ready(function() {
  function filterPath(string) {
    return string
      .replace(/^\//,'')
      .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
      .replace(/\/$/,'');
  }	
  $('a[href*=#]').each(function() {
    if ( filterPath(location.pathname) == filterPath(this.pathname)
    && location.hostname == this.hostname
    && this.hash.replace(/#/,'') ) {
      var $targetId = $(this.hash), $targetAnchor = $('[name=' + this.hash.slice(1) +']');
      var $target = $targetId.length ? $targetId : $targetAnchor.length ? $targetAnchor : false;
       if ($target) {
         var targetOffset = $target.offset().top;
         $(this).click(function() {
           $('html, body').animate({scrollTop: targetOffset}, 500);
		   return false;
         });
      }
    }
  });
});

/* ------Fade / Slide mini menu lateral------ */
$(document).ready(function(){
	
	$(window).scroll(function() {
		if($(window).scrollTop() > 75){
			/* Funcão fade ícone menu lateral */
			$("#menuLateral").fadeIn(900);
		}else{
			$("#menuLateral").hide();
			$("#listaMenuLateral").hide();
		}
		
	});
});