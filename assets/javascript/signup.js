var userName
var email
var password

// On SignUp Button clicked
$('#createButton').on('click', function () {

	// Grab the username
	userName = $('#userNameForSignup').val().trim()

	// Grab the email
	email = $('#emailAddressForSignup').val().trim()

	// Grab the password
	password = $('#passwordForSignup').val().trim()

	// Console log each of the user inputs to confirm we are receiving them
	console.log(userName)
	console.log(email)
	console.log(password)

	// If the email is true and then password is true
	if (email && password) {
		// Create user data and store in Firebase
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
			firebase.auth().onAuthStateChanged(function (user) {
				// Login with the entered information and enter into home.html page
				if (user) {
					database.ref('/user/' + user.uid).set({
						name: userName,
						email: email,
						password: password
					})

					document.location.href = "home.html"
					// If not valid, console log error message
				} else {
					console.log("User is not avaliable")
				}
			})
			//If unexpected user input...
		}).catch(function (error) {

			var errorCode = error.code
			var errorMessage = error.message
			// Console log error message
			console.log(errorCode + " " + errorMessage)

		})

	// Clear all text boxes
	} else {
		$('#userNameForSignup').val() = " "
		$('#emailAddressForSignup').val() = " "
		$('#passwordForSignup').val() = " "
	}
})









