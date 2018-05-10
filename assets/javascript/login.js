

// login in button clicked!
$('#loginButton').on('click', function(event){

  event.preventDefault()
  //get the email value from textfield
  var email = $('#emailForLogin').val()

  //get the password value from textfield
  var password = $('#passwordForLogin').val()


  console.log(email)
  console.log(password)

  firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){


    setTimer()

    document.location.href = "home.html"
    if(user){
      console.log("success : " + user.val().name)

    } else {
      console.log("no such user")
    }
  }).catch(function(error) {
   // Handle errors
 })

})



function setTimer() {
  console.log(document.documentElement.outerHTML)
  if (document.documentElement.outerHTML === "Welcome.html"){
    setTimeout(function() {
      document.location.href = "Profile.html"
    }, 5000)
  }
  
}







/*// Sign out user
firebase.auth().signOut()
 .catch(function (error) {
   // Handle errors
 });
*/