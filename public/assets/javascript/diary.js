

var map
var representBlogOfUserArray = []
var isFirstBlogLocation = false


function initMap() {
	// Styles a map in night mode.
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 40.674, lng: -73.945 },
		zoom: 12,
		styles: [
			{ elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
			{ elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
			{ elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
			{
				featureType: 'administrative.locality',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#d59563' }]
			},
			{
				featureType: 'poi',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#d59563' }]
			},
			{
				featureType: 'poi.park',
				elementType: 'geometry',
				stylers: [{ color: '#263c3f' }]
			},
			{
				featureType: 'poi.park',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#6b9a76' }]
			},
			{
				featureType: 'road',
				elementType: 'geometry',
				stylers: [{ color: '#38414e' }]
			},
			{
				featureType: 'road',
				elementType: 'geometry.stroke',
				stylers: [{ color: '#212a37' }]
			},
			{
				featureType: 'road',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#9ca5b3' }]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [{ color: '#746855' }]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [{ color: '#1f2835' }]
			},
			{
				featureType: 'road.highway',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#f3d19c' }]
			},
			{
				featureType: 'transit',
				elementType: 'geometry',
				stylers: [{ color: '#2f3948' }]
			},
			{
				featureType: 'transit.station',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#d59563' }]
			},
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [{ color: '#17263c' }]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#515c6d' }]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.stroke',
				stylers: [{ color: '#17263c' }]
			}
		]
	})

}



$(document).ready(function () {

	$('#logoutButton').on('click', function () {
		firebase.auth().signOut().then(function () {
			document.location.href = 'Login.html'
		}).catch(function (error) {
			console.log('There was some problem with log out: ' + error)
		})
	})

	$(document).on('click', 'button', function (value) {
		var blogIndex = $(this).val()
		var blogObject = representBlogOfUserArray[blogIndex]
		var userKey = blogObject.userKey
		var whichBlogRep = blogObject.whichBlogIsRepresent
		var likeCount = blogObject.likes + 1

		$(this).text(likeCount + ' Likes!')


		database.ref('/user/' + userKey + '/blogs/' + whichBlogRep).on('value', function (snap) {

			if (snap.hasChild('likeCounter')) {
				console.log('Say Cheese!')
				database.ref('/user/').child(userKey).child('blogs').child(whichBlogRep).child('likeCounter').update({ likes: likeCount })
			} else {
				database.ref('/user/').child(userKey).child('blogs').child(whichBlogRep).child('likeCounter').set({ likes: likeCount })
			}

		})

	})


	// 	$(document).on('click', 'a', function(value){
	// 		console.log($(this).attr('value'))
	// 		var userKeyIndex = $(this).attr('value')
	// 		var blogObject = representBlogOfUserArray[userKeyIndex]
	// 		var userKey = blogObject.userKey
	// 		var whichBlogRep = blogObject.whichBlogIsRepresent

	// 		var detailObject = {
	// 			userKey: userKey,
	// 			whichBlog: whichBlogRep
	// 		}

	// 		var myJSONObject = JSON.stringify(detailObject)
	// 		localStorage.setItem('blog', myJSONObject)
	// 		console.log(myJSONObject)

	// 		document.location.href = "detail.html"

	// 	})

	// 	firebase.auth().onAuthStateChanged(function(user){

	// 		if(user){

	// 			retrieveUserInfo(user.uid)
	// 			retrieveDatabase(user.uid)

	// 		} else {
	// 			console.log("The user is not logged-in")
	// 			document.location.href = "Login.html"
	// 		}
	// 	})


	// })




	function retrieveUserInfo(uid) {
		database.ref('/user/' + uid).once('value', function (snap) {
			var userObject = snap.val()
			var userName = userObject.name
			var userEmail = userObject.email
			var profilePic


			$('#userName').text(userName)
			$('#mainUserName').text(userName)
			$('#userEmail').text(userEmail)

			$('#titleUserName').text(userName)
			$('#userNameNavBar').text(userName)
			$('#userEmailNavBar').text(userEmail)


			if (userObject.profilePicture == undefined) {
				$('#preview').attr('src', "assets/images/default_profile.png")
			} else {
				profilePic = userObject.profilePicture.profile
				$('#preview').attr('src', profilePic)
			}

		})


	}


	function retrieveDatabase(uid) {
		console.log(uid)

		var numOfBlogs = 0
		var users
		var userKeyArray = []
		var whichBlog
		var representativePreviewPicture
		var isThisFirstPicture = false
		var mapDrawPolylineCoordinates = []
		var markers = []
		var indexes = 0
		var userUID
		var counter = 0

		database.ref('/user/').once('value', function (snapshot) {

			//numOfBlogs = snapshot.numChildren()

			users = snapshot.val()

			for (var key in users) {
				if (users.hasOwnProperty(key)) {
					userKeyArray.push(key)

				}
			}

			for (var users = 0; users < userKeyArray.length; users++) {
				userUID = userKeyArray[users]

				representBlogOfUserArray.push({
					index: users,
					userKey: userUID
				})

				console.log(representBlogOfUserArray)

				database.ref('/user/' + userUID).once('value', function (value) {
					var user_Name = value.val().name

					if (value.hasChild('blogs')) {

						if (value.val().blogs.length > 1) {
							var finalBlog = value.val().blogs
							console.log(finalBlog)
							var latestBlogObject = finalBlog[finalBlog.length - 1]
							console.log(latestBlogObject)
							whichBlog = (finalBlog.length - 1)
							console.log(whichBlog)


							var likeCounter

							if (latestBlogObject.likeCounter != null || latestBlogObject.likeCounter != undefined) {
								likeCounter = latestBlogObject.likeCounter.likes
								//console.log(likeCounter)
							} else {
								likeCounter = 0
							}


							for (var i = 0; i < latestBlogObject.Locations.length; i++) {

								var locationArray = latestBlogObject.Locations

								var likeCounter
								var date = latestBlogObject.timestamp
								var title = latestBlogObject.title
								var summary = latestBlogObject.journeyStory

								var lat = locationArray[i].lat
								var long = locationArray[i].long
								var markerLocation = { lat: lat, lng: long }

								if (isFirstBlogLocation === false) {
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

								marker.set('label', (i + 1).toString())
								var curLocMap = new google.maps.LatLng(lat, long)
								mapDrawPolylineCoordinates.push(curLocMap)

								if (locationArray[i].photo_1 != null || locationArray[i].photo_1 != undefined) {

									var description_photo1 = locationArray[i].photo_1.description
									var imgFileURL_photo1 = locationArray[i].photo_1.imgFileURL

									if (imgFileURL_photo1 != null || imgFileURL_photo1 != undefined) {


										if (isThisFirstPicture != true) {
											isThisFirstPicture = true
											representativePreviewPicture = imgFileURL_photo1

											representBlogOfUserArray[counter].whichBlogIsRepresent = whichBlog
											representBlogOfUserArray[counter].likes = likeCounter

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
																	.attr('id', i + ' blog')
																	.addClass('list-post list-post-b')
																	.append($('<div>')
																		.addClass('post-thumb')
																		.append($('<img>')
																			.attr('id', 'representPic_' + i)
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
																			.text(title))
																		.append($('<div>')
																			.addClass('post-content post-excerpt cf')
																			.append($('<p>')
																				.text(summary))
																			.append($('<p>')
																				.text('By ' + user_Name.toUpperCase())))
																		.append($('<div>')
																			.addClass('post-footer')
																			.append($('<a>')
																				.attr('value', counter)
																				.text('Detail')))
																		.append($('<hr>'))
																		.append($('<div>')
																			.append($('<button>')
																				.attr('value', counter)
																				.attr('id', 'likeButton_' + whichBlog.toString())
																				.addClass('btn btn-sm btn-info')
																				.append($('<span>')
																					.addClass('glyphicon glyphicon-thumbs-up'))
																				.text(likeCounter + ' Likes!'))))))))))



										}
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

							mapDrawPolylineCoordinates.length = 0
							isThisFirstPicture = false

						}

					}
					counter += 1
				})

			}

		})
	}
})