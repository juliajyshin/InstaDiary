var map
var markers = []
var mapDrawPolylineCoordinates = []
var isFirstMarker = false

function initMap() {
    // Styles a map in night mode.
    map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 40.674, lng: -73.945},
    	zoom: 12,
    	styles: [
    	{elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    	{elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    	{elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    	{
    		featureType: 'administrative.locality',
    		elementType: 'labels.text.fill',
    		stylers: [{color: '#d59563'}]
    	},
    	{
    		featureType: 'poi',
    		elementType: 'labels.text.fill',
    		stylers: [{color: '#d59563'}]
    	},
    	{
    		featureType: 'poi.park',
    		elementType: 'geometry',
    		stylers: [{color: '#263c3f'}]
    	},
    	{
    		featureType: 'poi.park',
    		elementType: 'labels.text.fill',
    		stylers: [{color: '#6b9a76'}]
    	},
    	{
    		featureType: 'road',
    		elementType: 'geometry',
    		stylers: [{color: '#38414e'}]
    	},
    	{
    		featureType: 'road',
    		elementType: 'geometry.stroke',
    		stylers: [{color: '#212a37'}]
    	},
    	{
    		featureType: 'road',
    		elementType: 'labels.text.fill',
    		stylers: [{color: '#9ca5b3'}]
    	},
    	{
    		featureType: 'road.highway',
    		elementType: 'geometry',
    		stylers: [{color: '#746855'}]
    	},
    	{
    		featureType: 'road.highway',
    		elementType: 'geometry.stroke',
    		stylers: [{color: '#1f2835'}]
    	},
    	{
    		featureType: 'road.highway',
    		elementType: 'labels.text.fill',
    		stylers: [{color: '#f3d19c'}]
    	},
    	{
    		featureType: 'transit',
    		elementType: 'geometry',
    		stylers: [{color: '#2f3948'}]
    	},
    	{
    		featureType: 'transit.station',
    		elementType: 'labels.text.fill',
    		stylers: [{color: '#d59563'}]
    	},
    	{
    		featureType: 'water',
    		elementType: 'geometry',
    		stylers: [{color: '#17263c'}]
    	},
    	{
    		featureType: 'water',
    		elementType: 'labels.text.fill',
    		stylers: [{color: '#515c6d'}]
    	},
    	{
    		featureType: 'water',
    		elementType: 'labels.text.stroke',
    		stylers: [{color: '#17263c'}]
    	}
    	]
    })

}

$(document).ready(function(){

    $('#logoutButton').on('click', function(){
        firebase.auth().signOut().then(function(){
            document.location.href = 'login.html'
        }).catch(function (error) {

        })
    })



    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            database.ref('/user/'+user.uid).once('value', function(snap){
                var userObject = snap.val()
                var userName = userObject.name
                var userEmail = userObject.email


                $('#userName').text(userName)
                $('#userEmail').text(userEmail)

                $('#titleUserName').text(userName)
                $('#userNameNavBar').text(userName)
                $('#userEmailNavBar').text(userEmail)

            })
            
            var specificBlogObj = localStorage.getItem('blog')
            specificBlogObj = JSON.parse(specificBlogObj)

            var userKey = specificBlogObj.userKey
            var whichBlogRep = specificBlogObj.whichBlog


            database.ref('/user/'+ userKey + '/blogs/' + whichBlogRep).once('value', function(snap){
                console.log(snap.val())
                var object = snap.val()

                var titleOfThisJourney = object.title
                $('#titleOfJourney').text(titleOfThisJourney)
                var story = object.journeyStory
                $('#story').text(story)

                var locations = object.Locations

                for(var i = 0; i < locations.length; i++){

                    var lat = locations[i].lat
                    var long = locations[i].long
                    var markerLocation = {lat: lat, lng: long}

                    if(isFirstMarker === false){
                        isFirstMarker = true
                        map.setZoom(12)
                        map.panTo(markerLocation)
                    }


                    var marker = new google.maps.Marker({
                        position: markerLocation,
                        map: map,
                        title: "Location Property"
                    })
                    markers.push(marker)

                    marker.set('label', (i+1).toString())
                    var curLocMap = new google.maps.LatLng(lat,long)
                    mapDrawPolylineCoordinates.push(curLocMap)


                    if (locations[i].photo_1 != null || locations[i].photo_1 != undefined) {
                        var imgFileURL = locations[i].photo_1.imgFileURL
                        var description = locations[i].photo_1.description
                        var locationIndex = locations[i].photo_1.locationIndex

                        $('#previewOfAddedPhotoContainer')
                        .append($('<container>')
                          .append($('<row>')
                            .append($('<div>')
                              .addClass('col-lg-4')
                              .addClass('text-center')
                              .append($('<img>')
                                .attr('src',imgFileURL)
                                .attr('height', '300px')
                                .attr('width','300px'))
                              .append($('<div>')
                                .append($('<p>')
                                  .text("Description: " + description))
                                .append($('<p>')
                                  .text("Location Index is " + locationIndex))))))


                        if(locations[i].photo_2 != null || locations[i].photo_2 != undefined) {
                            var imgFileURL_2 = locations[i].photo_2.imgFileURL
                            var description_2 = locations[i].photo_2.description
                            var locationIndex_2 = locations[i].photo_2.locationIndex

                            $('#previewOfAddedPhotoContainer')
                            .append($('<container>')
                              .append($('<row>')
                                .append($('<div>')
                                  .addClass('col-lg-5')
                                  .addClass('text-center')
                                  .append($('<img>')
                                    .attr('src',imgFileURL_2)
                                    .attr('height', '300px')
                                    .attr('width','300px'))
                                  .append($('<div>')
                                    .append($('<p>')
                                      .text("Description: " + description_2))
                                    .append($('<p>')
                                      .text("Location Index is " + locationIndex_2))))))

                        }
                    }


                }
                path = new google.maps.Polyline({
                    path: mapDrawPolylineCoordinates,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                })

                path.setMap(map)


            })

        } else {
            document.location.href = 'login.html'
        }

    })



  firebase.auth().onAuthStateChanged(function(user){

        if(user){
            retrieveDatabase(user.uid)

        } else {
            console.log("The user is not logged-in")
            document.location.href = "login.html"
        }
    })
    

})