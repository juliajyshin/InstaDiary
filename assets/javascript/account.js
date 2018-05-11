// Variables 
var userName
var syncUserObject 
var selectedFile

// Changing a profile picture
$('#profile-upload').on('change', previewFile)

function previewFile() {
  var preview = document.querySelector('img')
  selectedFile = document.querySelector('input[type=file]').files[0]
  console.log(selectedFile.name)
  reader = new FileReader()
  // Upload the photo and show a preview image
  reader.addEventListener('load', function () {
    $('#prof-upload').attr('src', reader.result)
  }, false)

  if (selectedFile) {
    reader.readAsDataURL(selectedFile)
  }
}

$('#saveButton').on('click', function () {
  uploadProfileImage()
})

// Upload Profile Image to Firebase
function uploadProfileImage() {
  // Create a root reference
  var filename = selectedFile.name;
  var storageRef = firebase.storage().ref('/profileImages/' + filename);
  var uploadTask = storageRef.put(selectedFile);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', function (snapshot) {
    // Observe state change events such as progress, pause, and resume
  }, function (error) {
    // Handle unsuccessful uploads
  }, function () {
    // Handle successful uploads on complete
    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
      console.log('File available at', downloadURL);
    });
  });
}

// function uploadPhotoToDatabase() {
//     firebase.auth().onAuthStateChanged(function (user) {
//       if (user) {
//         database.ref('/user/' + user.uid).once('value', function (snap) {

//           if (imgFile != null || imgFile != undefined) {
//             var storageRef = storage.ref('/' + user.uid + '/Photo_Stack/' + imgFile.name)
//             uploadTask = storageRef.put(imgFile)


//             uploadTask.on('state_changed', function (snapshot) {

//               var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//               console.log('Upload is ' + progress + '% done')

//             }, function (error) {
//               console.log('Uploading is failed = ' + error)

//             }, function () {

//               var downloadURL = uploadTask.snapshot.downloadURL

//               database.ref('/user/' + user.uid + '/profilePicture/').set({
//                 profile: downloadURL
//               })

//             })

//           }


//         })

//       } else {
//         document.location.href = 'Login.html'
//       }

//     })

//   }


$(document).ready(function () {

  $('#logoutButton').on('click', function () {
    firebase.auth().signOut().then(function () {
      document.location.href = 'Login.html'
    }).catch(function (error) {

    })
  })

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      database.ref('/user/' + user.uid).once('value', function (snap) {
        var userObject = snap.val()
        var userName = userObject.name
        var userEmail = userObject.email
        var profilePic


        $('#userName').text(userName)
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

        /*        if (userObject.profilePicture.profile != undefined || userObject.profilePicture.profile != null){
                  profilePic = userObject.profilePicture.profile
                  $('#preview').attr('src', profilePic)
                } else {
                  $('#preview').attr('src', "assets/images/default_profile.png")
                }*/



      })

    } else {
      document.location.href = 'Login.html'
    }

  })

})
