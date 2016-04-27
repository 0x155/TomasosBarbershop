/*
This file contains all functions that use AJAX to run
a PHP script to connect to and get information from the database.
*/

//Creates XMLHttpRequest object based on the browser
function createXmlHttpRequestObject(){
	var xmlhttp;
	//ActiveXObject is for IE5 and 6
	if(window.ActiveXObject){
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	//Other browsers use XMLHttpRequest
	else{
		xmlhttp = new XMLHttpRequest();
	}

	return xmlhttp;
}



function validateLogin(username, password){
	var xmlhttp = createXmlHttpRequestObject();
	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			var resultsDiv = document.getElementById("login_results");
			var response = xmlhttp.responseText;
			if(response === "valid"){
				window.location.href = "main_page.php";
			}
			else{
				resultsDiv.innerHTML = response;
				//set focus back to username field if invalid
			}
		}
	}
	xmlhttp.open("POST", "validate_login.php", true);

	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "username="+username+"&password="+password;
	xmlhttp.send(params);
}

function logOut(){
	var xmlhttp = createXmlHttpRequestObject();
	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			var resultsDiv = document.getElementById("log-out-results");
			var response = xmlhttp.responseText;
			if(response === "true"){
				window.location.href = "index.html";
			}
			else{
				resultsDiv.innerHTML = response;
			}

		}
	}
	xmlhttp.open("POST", "log_out_user.php", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send();
}

function customerSearch(){
	var xmlhttp = createXmlHttpRequestObject();
	var nameEntered = document.getElementById("customer_name").value;

	//This function is fired after each stage of the AJAX request
	//if condition is checking the state of the request
	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			var resultsDiv = document.getElementById("customer_search_results");
			resultsDiv.innerHTML = xmlhttp.responseText;

			//execute any javascript code which was generated
			//in the customer_search_results div
			//TO-DO: change to execute just the <script> generate in PHP
			var scripts = resultsDiv.getElementsByTagName("script");
			for(var i = 0; i < scripts.length; i++){
				eval(scripts[i].innerHTML);
			}
		}
	}

	//try/catch?

	//path to php file is relative to index.php page
	//xmlhttp.open("GET", "get_customer_data.php?name="+nameEntered, true);
	//xmlhttp.send();

	//Same thing using POST:
	xmlhttp.open("POST", "get_customer_data.php", true);

	//indicates the type of data you are sending
	//most servers will determine the data type, but good practice to set this
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	var params = "name="+nameEntered;

	xmlhttp.send(params);

	/*
	"Content-length" also can be set, but does not have to be. This lets the
	server know how much data is being sent, so it knows when it has received all
	the data.
	xmlhttp.setRequestHeader("Content-length", params.length);
	*/

	/*
	Should also use encodeURIComponent()
	var param1 = encodeURIComponent(nameEntered);
	//then
	xmlhttp.send("name="+param1);
	*/
}

/*
This function will call a PHP script to show a customer's full visit history.
Gets the customerName from the customer_name text field.
When there is a match, the name is pre-filled in this text box
*/
function viewCustomerHistory(startRow, numRows, customerName){
	//console.log("Enter viewCustomerHistory");
	//console.log("Start: " + startRow + ", NumRows: " + numRows + ", CusName: " + customerName);
	//Assigning default values for these parameters.
	//JS does not have default parameters like PHP
	//NOTE: Be mindful of this
	if(typeof(startRow) == "undefined"){
		startRow = 0;
	}
	if(typeof(numRows) == "undefined"){
		numRows = 5;
	}
	if(typeof(customerName) == "undefined"){
		customerName = document.getElementById("customer_name").value
	}

	var xmlhttp = createXmlHttpRequestObject();
	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState == 4) && (xmlhttp.status == 200)){
			var resultsDiv = document.getElementById("customer_history");
			resultsDiv.innerHTML = xmlhttp.responseText;
		}
	}

	xmlhttp.open("POST", "get_customer_history.php", true);

	//indicates the type of data you are sending
	//most servers will determine the data type, but good practice to set this
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "customer_name="+customerName+"&start_row="+startRow+"&num_rows="+numRows;
	//Need customerName, startRow, endRow
	//start/end row can be optional
	xmlhttp.send(params);
}

/*
These two functions are called when the user wants to see
next/prev visits of a customer when looking at the modal of the full history.
*/
function viewNextHistory(startRow, numRows){
	viewCustomerHistory((startRow + numRows), numRows);
}

function viewPrevHistory(startRow, numRows){
	viewCustomerHistory((startRow - numRows), numRows);
}

/*
This functions calls a PHP script to update customer information.
This is done from the custoemr search results when there is an exact match
(one customer returned)
*/
function updateCustomerInfo(){
	var doc = document;
	var customerName = doc.getElementById("customer_name").value;
	var customerID = doc.getElementById("customer-id").innerHTML;
	var customerPhone = doc.getElementById("edit-cust-info-phone").value;
	var customerEmail = doc.getElementById("edit-cust-info-email").value;

	var xmlhttp = createXmlHttpRequestObject();
	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			//response will be the number of rows affected(should be 1)
			//Result could also be 0 if user clicks Save without doing anything
			var response = xmlhttp.responseText;
			if(response === "1"){
				toggleEditCustInfoFields();
				dhtmlx.message({
					type:"edit-cust-info-msgbox",
					text:"Info Saved!"
				});
			}
			else if(response === "0"){
				toggleEditCustInfoFields();
				dhtmlx.message({
					type:"edit-cust-info-msgbox",
					text:"No info saved"
				});
			}
			else{
				doc.getElementById("cust_edit_info_results").innerHTML = response;
			}
		}
	}

	xmlhttp.open("POST", "update_customer_info.php", true);

	//indicates the type of data you are sending
	//most servers will determine the data type, but good practice to set this
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "customerID="+customerID+"&customerName="+customerName+"&phone="+customerPhone+"&email="+customerEmail;
	xmlhttp.send(params);
}
//}


/*Add New Customer*/
/*
This function will validate the information the user entered
when adding a new customer. Used below link as a reference
http://www.w3schools.com/js/js_validation.asp
The return value of this method is a boolean value indicating whether or not to submit the form.
If any of the data does not pass validation, return false.

Want to do data validation on both client-side(JS), AND server-side(PHP)
More validation is better than less, also the client-side validation in some instances can be bypassed.
The user could turn off JS, or the data could potentially come from another source other than the client front-end.
*/
function addNewCustomer() {
	var validFields = true;

	var doc = document;
	var newCustName = doc.getElementById("new_cust_name").value;
	var newCustGender = $("#new_cust_gender_field input[type='radio']:checked").val();
	var newCustCell = doc.getElementById("new_cust_cell_phone").value;
	var newCustHomeNumber = doc.getElementById("new_cust_home_phone").value;
	var newCustEmail = doc.getElementById("new_cust_email").value;
	var newCustHomeAddress = doc.getElementById("new_cust_address").value;
	var newCustBirthday = doc.getElementById("new_cust_birthday").value;
	var newCustBirthdayYear = doc.getElementById("new_cust_birthday_year").value;
	var newCustNotes = doc.getElementById("new_cust_notes").value;
	var newCustAllowText = doc.getElementById("allow_text_check").checked ? "T" : "F";
	var newCustAllowEmail = doc.getElementById("allow_email_check").checked ? "T" : "F";

	//If no radio button is selected, undefined will be returned
	//If undefined, set gender to empty string
	if(!newCustGender){
		newCustGender = "";
	}

	//Verify the user entered a name and cell number
	//This HTML field does have the required attribute set, but that
	//attribute is not supported in Safari
	if(newCustName.length === 0){
		$("#new_cust_name_label").addClass("emptyField");
		validFields = false;
		doc.getElementById("reqrd_fields_msg").style.display = "block";
	}
	else{
		$("#new_cust_name_label").removeClass("emptyField");
		doc.getElementById("reqrd_fields_msg").style.display = "none";
	}
	/*
	if(newCustCell.length === 0) {
		$("#new_cust_cell_label").addClass("emptyField");
		validFields = false;
		$("#reqrd_fields_msg").show();
	}
	 */

	//If the user checked Yes for Notification through texting, check there is a cell number entered
	if( (newCustAllowText === "T") && (newCustCell.length === 0) ){
		validFields = false;
		doc.getElementById("needs_cell_msg").style.display = "block";
		$("#new_cust_cell_label").addClass("emptyField");
	}
	else{
		doc.getElementById("needs_cell_msg").style.display = "none";
		$("#new_cust_cell_label").removeClass("emptyField");
	}

	//Same for email and email address
	if( (newCustAllowEmail === "T") && (newCustEmail.length === 0) ){
		validFields = false;
		doc.getElementById("needs_email_msg").style.display = "block";
		$("#new_cust_email_label").addClass("emptyField");
	}
	else{
		doc.getElementById("needs_email_msg").style.display = "none";
		$("#new_cust_email_label").removeClass("emptyField");
	}

	//Birthday
	//newCustBirthday is in form MM-DD
	var fullBirthday = ""
	if(newCustBirthday.length > 0){
		//If user didnt enter a year, use current year
		if(newCustBirthdayYear.length === 0){
			var today = new Date();
			newCustBirthdayYear = today.getFullYear();
		}
		fullBirthday = newCustBirthdayYear + "-" + newCustBirthday;
	}

	//Check that email address contains an "@" symbol and a dot ".",
	//if user entered one (Email address is not a required field)
	if(newCustEmail.length > 0){
		var atSymbol = newCustEmail.indexOf("@");
		var dot = newCustEmail.indexOf(".");
		if( (atSymbol === -1) || (dot === -1) ) {
			$("#new_cust_email_label").addClass("emptyField");
			validFields = false;
			doc.getElementById("invalid_email_msg").style.display = "block";
		}
		else{
			$("#new_cust_email_label").removeClass("emptyField");
			doc.getElementById("invalid_email_msg").style.display = "none";
		}
	}

	//if all fields are valid, then call PHP script to insert data into database
	if(validFields){
		var xmlhttp = createXmlHttpRequestObject();
		xmlhttp.onreadystatechange = function(){
			if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
				var response = xmlhttp.responseText;
				//The PHP script returns the "success" text if successful
				if(response === "success"){
					//Populate the Customer Name field with this new customer's name
					if(doc.getElementById("make_appt_new_cust").checked) {
						doc.getElementById("customer_name").value = newCustName;
					}
					$(".modal_wrapper").hide();
					clearAddNewCustomerFields();

					doc.getElementById("no-customer-returned").style.display = "none";
					dhtmlx.message("Customer Added!");
				}
				else{
					var addCustomerResults = doc.getElementById("add_customer_results");
					addCustomerResults.innerHTML = response;
				}
			}
		}

		xmlhttp.open("POST", "add_customer.php", true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		var params = "customer_name="+newCustName+"&gender="+newCustGender+"&cell_number="+newCustCell+
		"&home_number="+newCustHomeNumber+"&email="+newCustEmail+"&home_address="+newCustHomeAddress+
		"&birthday="+fullBirthday+"&notes="+newCustNotes+"&allow_text="+newCustAllowText+"&allow_email="+newCustAllowEmail;
		xmlhttp.send(params);
	}
	return validFields;
}


/*
Returns the IDs needed in order to schedule the appointment.
This includes the Customer.ID, Employee.ID, and Employee.Unit_ID.
If the appointment is "Unavailable", the CustomerID is set to 0.
The callback function will return these, and then run addEventToCalendar()
*/
function getApptIDs(customerNameIn, employeeNameIn, serviceIn, callbackFunc){
	var xmlhttp = createXmlHttpRequestObject();

	//This function is fired after each stage of the AJAX request
	//if condition is checking the state of the request
	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			var response = xmlhttp.responseText;
			/*
			The response from this AJAX call is a JSON_encoded'd string.
			Once the string is parsed as JSON, if the JSON object contains an "Error_Msgs" key,
			then that means the PHP script generated an error (the customer ID was not found for example)
			If this is the case, then display the error message.
			If the JSON object does not contain an Error_Msgs key, then no errors were found,
			so execute the callback function, which adds the event to the calendar.
			*/
			//JSON.parse() parses the ret string as a JSON object
			//ret returns as just a string in JSON format, parse() turns it into an actual JSON object
			//so the properties can be accessed
			var data = JSON.parse(response);
			if(data.hasOwnProperty("Error_Msgs")){
				var resultsDiv = document.getElementById("make_appt_results");
				resultsDiv.innerHTML = data.Error_Msgs;
				var error_msg_text = $(resultsDiv).text();
				//TO-DO: change this to alert, like in onEventCollision
				dhtmlx.message({
					type:"error",
					text: error_msg_text
				});
			}
			else{
				callbackFunc(data);
			}
		}
	}

	xmlhttp.open("POST", "get_appt_ids.php", true);

	//indicates the type of data you are sending
	//most servers will determine the data type, but good practice to set this
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "customerName="+customerNameIn+"&employeeName="+employeeNameIn+"&service="+serviceIn;
	xmlhttp.send(params);
}

/*
This function takes in an appointment ID and returns the list of services for that appointment
by querying the Appointment_Services table. This is called when the lightbox
is displayed, in order to display the services in the lightbox for each appointment.
*/
function getListOfServices(apptID, callbackFunc){
	var xmlhttp = createXmlHttpRequestObject();

	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			var response = xmlhttp.responseText;
			callbackFunc(response);
		}
	}

	xmlhttp.open("POST", "get_services.php", true);

	//indicates the type of data you are sending
	//most servers will determine the data type, but good practice to set this
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "apptID="+apptID;
	xmlhttp.send(params);
}

/*
This function will update the Appointment_Services table for a given appointment.
This is called when the user changes the services for an appointment from the lightbox.
Takes in the Appointment.ID of the appointment to change, and an array of Strings
representing the new services to be added.
*/
function updateServices(apptID, newServicesArr){
	var xmlhttp = createXmlHttpRequestObject();

	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			//var response = xmlhttp.responseText;
			//callbackFunc(response);
		}
	}

	xmlhttp.open("POST", "update_services.php", true);

	//indicates the type of data you are sending
	//most servers will determine the data type, but good practice to set this
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "apptID="+apptID+"&newSrvcs="+newServicesArr;
	xmlhttp.send(params);

}

/*
This AJAX function calls a PHP scrit to get the cellphonenumber for a customer
given their ID. The cell phone number is displayed in the lightbox.
The callback function assembles a string to append to the original title
in the lightbox.
*/
function getCustomerPhoneNumber(id, callback){
	var xmlhttp = createXmlHttpRequestObject();

	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			var response = xmlhttp.responseText;
			callback(response);
		}
	}

	xmlhttp.open("POST", "get_customer_phone.php", true);

	//indicates the type of data you are sending
	//most servers will determine the data type, but good practice to set this
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "cust_ID="+id;
	xmlhttp.send(params);
}
