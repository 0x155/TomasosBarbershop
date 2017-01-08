/*This is the Javascript used on the login page.*/

function validateLogIn(){
	var doc = document,
		enteredUsername = doc.getElementById("username").value,
		enteredPassword = doc.getElementById("password").value,
		errorMessage = doc.getElementById("login_fields_blank_msg");

	if((enteredUsername.length === 0) || (enteredPassword.length === 0)){
		errorMessage.style.display = "block";
		errorMessage.innerHTML = "Please Enter All Fields";
	}
	else{
		errorMessage.style.display = "none";
		errorMessage.innerHTML = "";
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
