

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

//
//	 FB.getLoginStatus(function(response) {
//	  if (response.status === 'connected') {
//		// the user is logged in and has authenticated your
//		// app, and response.authResponse supplies
//		// the user's ID, a valid access token, a signed
//		// request, and the time the access token 
//		// and signed request each expire
//		var uid = response.authResponse.userID;
//		var accessToken = response.authResponse.accessToken;
//	  } else if (response.status === 'not_authorized') {
//		// the user is logged in to Facebook, 
//		// but has not authenticated your app
//	  } else {
//		// the user isn't logged in to Facebook.
//	  }
//	 });



FB.getLoginStatus(function(response) {
  var loginButton = document.getElementById('navLoginBtn');
  var postButton = document.getElementById('navPostBtn');
  if (response.status === 'connected') {
	loginButton.style.display = 'none';
	} else {
	postButton.style.display = 'none';
	}
});

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


  
//End of initialization


//Redirect on click
$(document).on('click', '#search', function() {
	window.location = 'grid.html';
});

//Image upload function
function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
	//loop for picture
	for (var i = 0, f; f = files[i]; i++) {
		var reader = new FileReader();
		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function(e) {
				// Render thumbnail.
				var span = document.createElement('span');
				span.innerHTML = ['<img class="inputPic" src="', e.target.result,
					'" title="', escape(theFile.name), '"/>'
				].join('');
				document.getElementById('list').insertBefore(span, null);
			};
		})(f);
		// Read in the image file as a data URL.
		reader.readAsDataURL(f);
	}
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);

$(document).on("click",".inputPic", function(){
   $( ".inputPic" ).remove();
   $("#files").val("")
});


  
  