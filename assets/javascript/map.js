

var isFinishedEdit = false
var currentLat
var currentLng
var locationLists = []
var markerLocation
var markers = []
var path
var mapDrawPolylineCoordinates = []
var newMap
var locationCounter = 0
var whichBlogNum

var imgFile
var imgURL
var reader
var imgArray = []

var nameOfJourney
var journeyStory
var isClickable = false



function initMap() {


    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("not getting location")
        }
    }


    function showPosition(position) {
        currentLat = position.coords.latitude
        currentLng = position.coords.longitude
        console.log(currentLat + " " + currentLng)

        var curLocMap = new google.maps.LatLng(currentLat, currentLng)

        newMap.setCenter(curLocMap)
        newMap.setZoom(12)

    }

    getLocation()

    // Styles a map in night mode.
    newMap = new google.maps.Map(document.getElementById('map_editing'), {
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


    google.maps.event.addListener(newMap, "click", function (event) {

        if (isFinishedEdit === false) {

            var latLng = event.latLng
            var lat = latLng.lat()
            var long = latLng.lng()
            console.log(lat + " " + long)
            markerLocation = { lat: lat, lng: long }



            if (isClickable === false) {
                $('#pinModal').modal('show')

                $('#modalYes').on('click', function (event) {
                    isClickable = true
                })
            } else {
                locationCounter += 1
                var marker = new google.maps.Marker({
                    position: markerLocation,
                    map: newMap,
                    title: "Location Property"
                })
                markers.push(marker)

                marker.set('label', locationCounter.toString())

                locationLists.push({ lat: lat, long: long })

                var curLocMap = new google.maps.LatLng(lat, long)

                mapDrawPolylineCoordinates.push(curLocMap)

            }





            /*                    if(confirm("Do you want to add a marker on this specific location?")){
                                  locationCounter += 1
                                  var marker = new google.maps.Marker({
                                    position: markerLocation,
                                    map: newMap,
                                    title: "Location Property"
                                  })
                                  markers.push(marker)
            
                                  marker.set('label', locationCounter.toString())
            
                                  locationLists.push({lat: lat, long: long})
            
                                  var curLocMap = new google.maps.LatLng(lat,long)
            
                                  mapDrawPolylineCoordinates.push(curLocMap)
            
            
                                }*/

        } else {

            // This part should let user know in order to put more pins on the map should click edit button!!

        }

    })
}



$(document).ready(function () {



    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            database.ref('/user/' + user.uid).once('value', function (snap) {
                var userObject = snap.val()
                var userName = userObject.name
                var userEmail = userObject.email


                $('#userName').text(userName)
                $('#mainUserName').text(userName)
                $('#userEmail').text(userEmail)

                $('#titleUserName').text(userName)
                $('#userNameNavBar').text(userName)
                $('#userEmailNavBar').text(userEmail)

            })

        } else {
            document.location.href = 'Login.html'
        }

    })

    //hide preview photo container when the html loaded
    $('#addedPhotoContainer').hide()


    $('#didFinishedEditing').on('click', function (event) {

        // reset the location index option
        $('#locationNum').empty()

        for (var i = 0; i < locationLists.length; i++) {
            $('#locationNum').append($('<option>').text(i + 1))
        }

        if (isFinishedEdit === true) {
            isFinishedEdit = false
            $('#didFinishedEditing').text('Finished')
            console.log("adding")


        } else {

            path = new google.maps.Polyline({
                path: mapDrawPolylineCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            })

            path.setMap(newMap)

            isFinishedEdit = true
            $('#didFinishedEditing').text('Edit')


        }
    })


    $('#addPhotoAndDescription').on('click', function (event) {
        event.preventDefault()


        $('#addedPhotoContainer').show()

        var photoObject = {
            imageData: imgFile,
            locationIndex: ($('#locationNum').val() - 1),
            description: $('#textareaID').val()
        }


        imgArray.push(photoObject)

        for (var i = 0; i < locationLists.length; i++) {
            if (photoObject.locationIndex === i) {
                // need to fixed to be able to add multiple photos @ same location
                if (locationLists[i].photo_1 == null || locationLists[i].photo_1 == undefined) {
                    locationLists[i].photo_1 = photoObject
                    console.log(locationLists)
                } else {
                    locationLists[i].photo_2 = photoObject
                    console.log(locationLists)
                }

            }
        }



        $('#previewOfAddedPhotoContainer')
            .append($('<container>')
                .append($('<row>')
                    .append($('<div>')
                        .addClass('col-lg-4')
                        .addClass('text-center')
                        .append($('<img>')
                            .attr('src', reader.result)
                            .attr('height', '300px')
                            .attr('width', '300px'))
                        .append($('<div>')
                            .append($('<p>')
                                .text("Description: " + $('#textareaID').val()))
                            .append($('<p>')
                                .text("Location Index is " + $('#locationNum').val()))))))



        $('#preview').attr('src', 'https://media.giphy.com/media/OQemfICSHDAly/giphy.gif')
        $('#gettingImgFile').val('')
        $('#textareaID').val('')

    })



    $('#uploadPhotos').on('click', function () {

        if ($('#uploadPhotos').val() === '1') {
            document.location.href = "profile.html"
        } else {
            $('#previewOfAddedPhotoContainer').empty()
            $('#previewOfAddedPhotoContainer').addClass('text-center')
            $('#previewOfAddedPhotoContainer').append($('<div>')
                .addClass('loader').css({
                    'margin': '0 auto'
                }))


            firebase.auth().onAuthStateChanged(function (user) {


                if (user) {

                    var date = moment().format('MMM DD, YYYY')

                    if ($('#nameOfJourney').val() != undefined || $('#nameOfJourney').val() != null) {
                        nameOfJourney = $('#nameOfJourney').val()

                    } else {
                        nameOfJourney = "Memorial Journey"
                    }
                    if ($('#textarea1').val() != undefined || $('#textarea1').val() != null || $('#textarea1').val() != undefined) {
                        journeyStory = $('#textarea1').val()
                    } else {
                        journeyStory = "The Best Moment of My Life"

                    }


                    database.ref('/user/' + user.uid).once('value', function (children) {
                        if (children.hasChild('blogs')) {
                            console.log("it does has child named blogs")
                            database.ref('/user/' + user.uid + '/blogs/').once('value', function (value) {

                                var numberOfChildren = value.numChildren()
                                whichBlogNum = numberOfChildren + 1
                                var likeKey




                                database.ref('/user/' + user.uid + "/blogs/" + (numberOfChildren + 1)).set({
                                    Locations: locationLists,
                                    title: nameOfJourney,
                                    journeyStory: journeyStory,
                                    timestamp: date
                                })
                                database.ref('/user/' + user.uid + "/blogs/" + (numberOfChildren + 1) + '/likeCounter/').set({
                                    likes: 0
                                })

                            })

                        } else {
                            console.log("it does NOT NOT has child named blogs")

                            database.ref('/user/' + user.uid + "/blogs/" + 1).set({
                                Locations: locationLists,
                                title: nameOfJourney,
                                journeyStory: journeyStory,
                                timestamp: date
                            })
                            database.ref('/user/' + user.uid + "/blogs/" + 1 + '/likeCounter/').set({
                                likes: 0
                            })
                        }

                    })


                    var howManyUploading = 0

                    for (var i = 0; i < locationLists.length; i++) {

                        if (locationLists[i].photo_1 != null || locationLists[i].photo_1 != undefined) {
                            console.log(locationLists[i])
                            var imageFile = locationLists[i].photo_1.imageData
                            delete locationLists[i].photo_1.imageData

                            howManyUploading += 1
                            uploadImageAsPromise(imageFile, i, user.uid, 1)

                            if (locationLists[i].photo_2 != null || locationLists[i].photo_2 != undefined) {
                                var secondImgFile = locationLists[i].photo_2.imageData
                                delete locationLists[i].photo_2.imageData
                                howManyUploading += 1
                                uploadImageAsPromise(secondImgFile, i, user.uid, 2)
                            }
                        }

                    }


                    function uploadImageAsPromise(imageFile, index, uid, firOrSec) {
                        return new Promise(function (resolve, reject) {

                            var storageRef = firebase.storage().ref('/' + uid + '/Photo_Stack/' + imageFile.name)
                            var uploadTask = storageRef.put(imageFile)


                            uploadTask.on('state_changed', function (snapshot) {

                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                console.log('Upload is ' + progress + '% done')
                                if (progress === 100) {
                                    howManyUploading -= 1
                                    if (howManyUploading <= 0) {
                                        $('#previewOfAddedPhotoContainer').empty()
                                        $('#previewOfAddedPhotoContainer').append($('<h2>').text('Uploading is done!'))
                                        $('#uploadPhotos').val('1')
                                        $('#uploadPhotos').text('Home')
                                        $('#nameOfJourney').val('')
                                        $('#textarea1').val('')
                                        $('#locationNum').empty()
                                        locationCounter = 0
                                        path.setMap(null)
                                        for (var i = 0; i < markers.length; i++) {
                                            markers[i].setMap(null)
                                        }


                                        isFinishedEdit = false
                                        $('#didFinishedEditing').text('Finished')

                                        setTimeout(function () {
                                            //Make locationLists empty array again!!
                                            locationLists.length = 0
                                        }, 6000)

                                        setTimeout(function () {
                                            $('#addedPhotoContainer').hide()
                                        }, 10000)

                                    }
                                }

                                switch (snapshot.state) {
                                    case firebase.storage.TaskState.PAUSED:
                                        console.log('Upload is paused')
                                        break;
                                    case firebase.storage.TaskState.RUNNING:
                                        console.log('Upload is running')
                                        break;
                                }
                            }, function (error) {
                                switch (error.code) {
                                    case 'storage/unauthorized':
                                        console.log('User doesn\'t have permission to access the object')
                                        break

                                    case 'storage/canceled':
                                        console.log('User canceled the upload')
                                        break

                                    case 'storage/unknown':
                                        console.log('Unknown error occurred, inspect error.serverResponse')
                                        break
                                }
                            }, function () {


                                // IMPORTANT NOTE!!!
                                /* For the first blog, firebase takes time to creating data structure
                                  Therefore, we do not know where to upload so we are assuming that this is first time we ever upload photo blog
                                  so we put first index into whichBlogNum = 1 so that it knows where to put
         
                                */
                                //--------------------------------------------------------------//
                                if (whichBlogNum === undefined) {
                                    whichBlogNum = 1
                                }
                                //--------------------------------------------------------------//


                                var downloadURL = uploadTask.snapshot.downloadURL
                                if (firOrSec === 1) {
                                    locationLists[index].photo_1.imgFileURL = downloadURL

                                    database.ref('/user/' + user.uid).child('blogs').child(whichBlogNum.toString()).child('Locations').child(index.toString()).child('photo_1').set({
                                        locationIndex: index,
                                        description: locationLists[index].photo_1.description,
                                        imgFileURL: downloadURL

                                    })
                                } else {
                                    locationLists[index].photo_2.imgFileURL = downloadURL
                                    database.ref('/user/' + user.uid).child('blogs').child(whichBlogNum.toString()).child('Locations').child(index.toString()).child('photo_2').set({
                                        locationIndex: index,
                                        description: locationLists[index].photo_2.description,
                                        imgFileURL: downloadURL
                                    })
                                }


                            })

                        })
                    }


                } else {
                    console.log("can not grab the user")
                }
            })

        }



    })






    $('#gettingImgFile').on('change', previewFile)

    function previewFile() {
        var preview = document.querySelector('img')
        imgFile = document.querySelector('input[type=file]').files[0]
        console.log(imgFile.name)
        reader = new FileReader()


        reader.addEventListener('load', function () {
            $('#preview').attr('src', reader.result)
        }, false)

        if (imgFile) {
            //imgURL = reader.readAsDataURL(imgFile)
            reader.readAsDataURL(imgFile)

        }
    }




    var textarea = document.querySelector('textarea');

    textarea.addEventListener('keydown', autosize);


    function autosize() {
        var el = this
        setTimeout(function () {
            el.style.cssText = 'height:auto; padding:0'
            el.style.cssText = 'height:' + el.scrollHeight + 'px'
        }, 0);
    }




    $('#logoutButton').on('click', function () {
        firebase.auth().signOut().then(function () {
            document.location.href = 'Login.html'
        }).catch(function (error) {
            // Handle errors
        })
    })


})
