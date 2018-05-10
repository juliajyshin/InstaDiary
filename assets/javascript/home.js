

var map
var isFirstLocation = false

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



$('#addJourney').on('click', function(event){
	event.preventDefault()

	document.location.href = "Add_Journey.html"
})



// $(document).ready(function(){

// 	$('#logoutButton').on('click', function(){
// 		firebase.auth().signOut().then(function(){
// 			document.location.href = 'Login.html'
// 		}).catch(function (error) {
//                      // Handle errors
//         })
// 	})



// 	firebase.auth().onAuthStateChanged(function(user){
// 		if(user){
// 			database.ref('/user/'+user.uid).once('value', function(snap){
// 				var userObject = snap.val()
// 				var userName = userObject.name
// 				var userEmail = userObject.email
// 				var profilePic


// 				$('#userName').text(userName)
// 				$('#mainUserName').text(userName)
// 				$('#userEmail').text(userEmail)

// 				$('#titleUserName').text(userName)
// 				$('#userNameNavBar').text(userName)
// 				$('#userEmailNavBar').text(userEmail)


// 				if(userObject.profilePicture == undefined){
// 					$('#preview').attr('src', "assets/images/default_profile.png")
// 				} else {
// 					profilePic = userObject.profilePicture.profile
// 					$('#preview').attr('src', profilePic)
// 				}



// 			})

// 		} else {
// 			document.location.href = 'Login.html'
// 		}

// 	})



// 	firebase.auth().onAuthStateChanged(function(user){

// 		if(user){
// 			retrieveDatabase(user.uid)

// 		} else {
// 			console.log("The user is not logged-in")
// 			document.location.href = "Login.html"
// 		}
// 	})


// })

function retrieveDatabase(uid) {
	console.log(uid)

	var numOfBlogs = 0
	var whichBlog = 0
	var representativePreviewPicture
	var isThisFirstPicture = false
	var mapDrawPolylineCoordinates = []

	database.ref('/user/' + uid + '/blogs/').once('value',function(snapshot){

		numOfBlogs = snapshot.numChildren()
		

		for(var i = numOfBlogs; i > 0; i--) {



			whichBlog = i

			database.ref('/user/'+uid).child('blogs').child(i.toString()).once('value', function(value){
				console.log(value.val())
				var blogObjectArray = value.val()

				var title
				if(blogObjectArray.title != null || blogObjectArray.title != undefined){
					title = blogObjectArray.title
				}
				var summary = blogObjectArray.journeyStory
				var date = blogObjectArray.timestamp



				var locationObjectArray = value.val().Locations

				var likeCounter

				if(blogObjectArray.likeCounter != null || blogObjectArray.likeCounter != undefined){
					likeCounter = blogObjectArray.likeCounter.likes
					//console.log(likeCounter)
				} else {
					likeCounter = 0
				}


				for(var i = 0; i < locationObjectArray.length; i++){

					var lat = locationObjectArray[i].lat
					var long = locationObjectArray[i].long
					var markerLocation = {lat: lat, lng: long}

					var marker = new google.maps.Marker({
						position: markerLocation,
						map: map,
						title: "Location Property"
					})
					//markers.push(marker)

					if(isFirstLocation === false){
						isFirstLocation = true
                        map.setZoom(12)
                        map.panTo(markerLocation)
					}

					marker.set('label', (i+1).toString())
					var curLocMap = new google.maps.LatLng(lat,long)
					mapDrawPolylineCoordinates.push(curLocMap)



					if(locationObjectArray[i].photo_1 != null || locationObjectArray[i].photo_1 != undefined){
						
						var description_photo1 = locationObjectArray[i].photo_1.description
						var imgFileURL_photo1 = locationObjectArray[i].photo_1.imgFileURL

						if(isThisFirstPicture != true){
							isThisFirstPicture = true
							representativePreviewPicture = imgFileURL_photo1

							$('#blogs').append($('<hr>'), $('<br>'), $('<div>')
								.addClass('container')
								.append($('<div>')
									.addClass('row')
									.append($('<div>')
										.addClass('col-sm-1'))
									.append($('<div>')
										.addClass('col-md-9')
										.append($('<div>')
											.addClass('blog-post-display')
											.append($('<div>')
												.addClass('posts-wrap')
												.append($('<article>')
													.attr('id', i+' blog')
													.addClass('list-post list-post-b')
													.append($('<div>')
														.addClass('post-thumb')
														.append($('<img>')
															.attr('id', 'representPic_'+i)
															.attr('src', representativePreviewPicture)
															.attr('width', '300')
															.attr('height', '300')))
													.append($('<div>')
														.addClass('content')
														.append($('<div>')
															.addClass('post-meta')
															.addClass('padding_top')
															.append($('<time>')
																.text(date)))
														.append($('<h2>')
															.addClass('post-title')
															.attr('id', 'representTitle_'+i)
															.text(title))
														.append($('<div>')
															.addClass('post-content post-excerpt cf')
															.append($('<p>')
																.attr('id', 'representStory_'+i)
																.text(summary)))
														.append($('<hr>'))
														.append($('<div>')
															.text(' '+likeCounter+' Likes!')
															.addClass('redness')))))))))

						}
						

						if(locationObjectArray[i].photo_2 != null || locationObjectArray[i].photo_2 != undefined){
							var description_photo2 = locationObjectArray[i].photo_2.description
							var imgFileURL_photo2 = locationObjectArray[i].photo_2.imgFileURL
						}
					} else {

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

				mapDrawPolylineCoordinates.length = 0
				isThisFirstPicture = false
			})

		}
	})

}