/*This is the Javascript used on the login page.*/

function validateLogIn(){
	var doc = document;
	var enteredUsername = doc.getElementById("username").value;
	var enteredPassword = doc.getElementById("password").value;

	if((enteredUsername.length === 0) || (enteredPassword.length === 0)){
		doc.getElementById("login_fields_blank_msg").style.display = "block";
	}
	else{
		doc.getElementById("login_fields_blank_msg").style.display = "none";
		validateLogin(enteredUsername, enteredPassword);
	}
}

//Checks if the user pressed Enter,
//if so, validate login
function checkEnter(e){
	if(e.keyCode === 13){
		validateLogIn();
	}
}