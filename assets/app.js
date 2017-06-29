//Initialize Facebook API
window.fbAsyncInit = function () {
    FB.init({
        appId: '679455808909655',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
    });
    FB.AppEvents.logPageView();
    FB.getLoginStatus(function (response) {
        var loginButton = document.getElementById('navLoginBtn');
        var postButton = document.getElementById('navPostBtn');

        if (response.status === 'connected') {
            loginButton.style.display = 'none';
        } else {
            postButton.style.display = 'none';
        }
    });

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//Creates a Facebook login button
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9&appId=1679455808909655";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//If Faceback callback for login status is connected, redirect to main html page
var checkLogin = function () {
    document.location.href = 'grid.html';
}

//Initialize GoogleMaps API	
function initMap() {
    var florida = {
        lat: 28.54,
        lng: -81.38
    };
    var map = new google.maps.Map(document.getElementById('map'), {

        zoom: 7,

        center: florida
    });
    var marker = new google.maps.Marker({
        position: florida,
        map: map
    });

    var input = document.getElementById('location-input');
    var autocomplete = new google.maps.places.SearchBox(input);
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
var database = firebase.database();
var myLocation = "";
var item = "";
var description = "";
var pic = "";
//captures information from input section when user hits the submit button  
var file;
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
            console.log(downloadURL);
            console.log("item: ", item);
            console.log("description: ", description);
            console.log("location: ", myLocation);
        });
        //clear form
        $("#location-input").val("");
        $("#item-input").val("");
        $("#description-input").val("");
        $("#files").val("");
        $(".inputPic").remove();
        $(".modal-content").hide();
    });
});

database.ref().on("child_added", function (snapshot) {
            console.log(snapshot.val());
            console.log(snapshot.val().myLocation);
            console.log(snapshot.val().item);
            console.log(snapshot.val().url);
            console.log(snapshot.val().description);
    var items = snapshot.val().item;
    var itemLocation = snapshot.val().myLocation;
    var imgURL = snapshot.val().url;
    var information = snapshot.val().description;

            var imageDiv = $("<div>");
            //$(imageDiv).addClass("media-left")
            var imageLoad = $("<img>");
            $(imageLoad).attr("src", imgURL);
            $(imageLoad).addClass("imgPic");
            var tableImg = $(imageDiv).append(imageLoad);
            
            var textDiv = $("<div>");
            $(textDiv).addClass("bodyText");
            var itemInfo = "<h4>" + items + "</h4>" + "<br>" + itemLocation + information ;
            var tableText = $(textDiv).append(itemInfo);
            
            var contents = $(tableImg).append(itemInfo);
            var tableRows = $(".list-group").prepend(contents);

                },
                function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

        //Redirect on click
        $("#search").click(function () {
            window.location.href = 'grid.html';
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

        $(document).on("click", ".inputPic", function () {
            $(".inputPic").remove();
            $("#files").val("");

        });
