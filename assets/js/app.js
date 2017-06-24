window.fbAsyncInit = function() {
    FB.init({
      appId      : '679455808909655',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();   
  };
 (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9&appId=1679455808909655";
	  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
 
 var checkLogin = function() {
 	document.location.href = 'grid.html';
 	}
	
 function initMap() {
	var uluru = {lat: 28.54, lng: -81.38};
	var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 4,
	center: uluru
	});
	var marker = new google.maps.Marker({
	position: uluru,
	map: map
	});
}
 