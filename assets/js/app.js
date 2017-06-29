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
  console.log('line 11');
var database = firebase.database();

var myLocation;
var item;
var description;
var pic;
var markers = [];

//Initialize Facebook API
window.fbAsyncInit = function() {
	FB.init({
	  appId      : '679455808909655',
	  cookie     : true,
	  xfbml      : true,
	  version    : 'v2.8'
	});
	FB.AppEvents.logPageView();
	//Check login status and show/hide buttons
	FB.getLoginStatus(function(response) {
	  var loginButton = document.getElementById('navLoginBtn');
	  var postButton = document.getElementById('navPostBtn');
	  if (response.status === 'connected') {
		loginButton.style.display = 'none';
		} else {
		postButton.style.display = 'none';
		}
	});
	console.log('Facebook initialized');

};
//Connects to Facebook SDK
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
		zoom: 9,
		center: florida
	});

	//Autocomplete searchbox for post-item modal
	var input = document.getElementById('location-input');
	var autocomplete = new google.maps.places.SearchBox(input);
	autocomplete.bindTo('bounds', map);
	console.log('autocomplete initialized');

	//Geocodes text-input from location field
	var geocoder = new google.maps.Geocoder();
	database.ref().on("child_added", function(snapshot) {
		var address = snapshot.val().myLocation;
		var infowindow = new google.maps.InfoWindow({
        	content: snapshot.val().item
     	});
		
		function geocodeAddress(geocoder, resultsMap) {
			geocoder.geocode({'address': address}, function(results, status) {
				if (status === 'OK') {
					resultsMap.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: resultsMap,
						position: results[0].geometry.location
					});
					markers.push(marker);
					marker.addListener('click', function() {
						infowindow.open(map, marker);
					});
				}
			});
		}
		geocodeAddress(geocoder, map);
	});
}


//End of initialization


//Redirect on click
$("#search").click(function() {
	window.location.href = 'grid.html';
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

$(document).on("click","#submit", function() {

	myLocation = $("#location-input").val().trim();
	item = $("#item-input").val().trim();
	description = $("#description-input").val().trim()

	firebase.database().ref().push({
	myLocation: myLocation,
	item: item,
	description: description,
	dateAdded:firebase.database.ServerValue.TIMESTAMP
	});
});

database.ref().on("child_added", function(snapshot) {
	$("#itemTable").append(
		"<div class='media'> <div class='media-left media-top'> <img class='media-object' src=" + snapshot.val().url + "> </div> <div class='media-body'> <h4 class='media-heading'>" + snapshot.val().item + "</h4>" + snapshot.val().description + "</div></div>"
	)
});
