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
};

//Initialize GoogleMaps API	
function initMap() {
	var florida = {lat: 28.54, lng: -81.38}; //Starting point for map is Orlando
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
	//Grabs location info from Firebase
	database.ref().on("child_added", function(snapshot) {
		var address = snapshot.val().myLocation;
		//Creates an infowindow above map markers with the item name and location
		var infowindow = new google.maps.InfoWindow({
        	content: snapshot.val().item + "<br>" + address
     	});
		//This function reverse geocodes our Firebase location string to LatLng to create a marker
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

//Redirect on click
$("#search").click(function() {
	window.location.href = 'grid.html';
});

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

var database = firebase.database();

var myLocation;
var item;
var description;
var pic;
var file;
var markers = [];


//Creates an Item table
database.ref().on("child_added", function(snapshot) {
	$("#itemTable").append(
		"<div class='media'> <div class='media-left media-top'> <img class='media-object' src=" + snapshot.val().url + "> </div> <div class='media-body'> <h4 class='media-heading'>" + snapshot.val().item + "</h4>" + snapshot.val().description + "</div></div>"
	)
});


//captures information from input section when user hits the submit button  

//get image file to firebase storage
$(document).on("change", "#files", function (event) {
    var file = event.target.files[0];

    $(document).on("click", "#submit", function (event) {
        event.preventDefault();
		
		myLocation = $("#location-input").val().trim();
		item = $("#item-input").val().trim();
		description = $("#description-input").val().trim();

        // Create a root reference
        var storageRef = firebase.storage().ref("UploadedFiles" + file.name);
        var uploadTask = storageRef.put(file);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', function (snapshot) {

        }, function (error) {
            // Handle unsuccessful uploads
        }, function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var newPostKey = firebase.database().ref().child('posts').push().key;
            var downloadURL = uploadTask.snapshot.downloadURL;
            var updates = {};
            var postData = {
                url: downloadURL,
				myLocation: myLocation,
                item: item,
                description: description,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            };
            updates[newPostKey] = postData
            firebase.database().ref().update(updates);
        });
        //clear form
        $("#location-input").val("");
        $("#item-input").val("");
        $("#description-input").val("");
        $("#files").val("");
        $(".inputPic").remove();
//        $(".modal-content").hide();
    });
});


//Image upload function
function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
	//loop for picture
	for (var i = 0, f; f = files[i]; i++) {
		var reader = new FileReader();
		// Closure to capture the file information.
		reader.onload = (function (theFile) {
			return function (e) {
				// Render thumbnail.
				var span = document.createElement('span');
				span.innerHTML = ['<img class="inputPic" src=', e.target.result,
			' title="', escape(theFile.name), '"/>'
		].join('');
				document.getElementById('list').insertBefore(span, null);
			};
		})(f);
		// Read in the image file as a data URL.
		reader.readAsDataURL(f);
	}
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

$(document).on("click", ".inputPic", function () {
	$(".inputPic").remove();
	$("#files").val("");
});
