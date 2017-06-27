$(document).on('click', '#search', function() {
	window.location = 'grid.html';
});

//Initialize Facebook API
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

//Creates a Facebook login button
(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9&appId=1679455808909655";
	  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
 
 //If Faceback callback for login status is connected, redirect to main html page
 var checkLogin = function() {
 	document.location.href = 'grid.html';
 	}
	
//Initialize GoogleMaps API	
 function initMap() {
	var florida = {lat: 28.54, lng: -81.38};
	var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 6,
	center: florida
	});
	var marker = new google.maps.Marker({
	position: florida,
	map: map
	});
}

//Initialize Firebase
var config = {
    apiKey: "AIzaSyBRk12SsqUScaiXgY2oUgVRIhHRpKqzPq0",
    authDomain: "yoink-1b31d.firebaseapp.com",
    databaseURL: "https://yoink-1b31d.firebaseio.com",
    projectId: "yoink-1b31d",
    storageBucket: "yoink-1b31d.appspot.com",
    messagingSenderId: "426906359481"
  };
  firebase.initializeApp(config);
  
  
  