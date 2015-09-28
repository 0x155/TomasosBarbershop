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
	var customerPhone = doc.getElementById("edit-cust-info-phone").value;
	var customerEmail = doc.getElementById("edit-cust-info-email").value;

	//TO-DO: validate phone number and email entered

	var xmlhttp = createXmlHttpRequestObject();
	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			//response will be the number of rows affected(should be 1)
			//Result could also be 0 if user clicks Save without doing anything
			var response = xmlhttp.responseText;
			if(response === "1"){
				toggleEditCustInfoFields();
				$(".ajax_error").hide();
				//display left-aligned msg box when customer data is saved
				dhtmlx.message({
					type:"edit-cust-info-msgbox",
					text:"Info Saved!"
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
	var params = "customerName="+customerName+"&phone="+customerPhone+"&email="+customerEmail;
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
	var newCustNotes = doc.getElementById("new_cust_notes").value;
	var newCustAllowText = doc.getElementById("allow_text_check").checked ? "T" : "F";
	var newCustAllowEmail = doc.getElementById("allow_email_check").checked ? "T" : "F";

	//If no radio button is selected, undefined will be returned
	//If undefined, set gender to empty string
	if(!newCustGender){
		newCustGender = "";
	}
	/*
	console.log("--New Customer Info---");
	console.log(newCustName);
	console.log(newCustGender);
	console.log(newCustCell);
	console.log(newCustHomeNumber);
	console.log(newCustEmail);
	console.log(newCustHomeAddress);
	console.log(newCustBirthday);
	console.log(newCustNotes);
	console.log(newCustAllowText);
	console.log(newCustAllowEmail);
	console.log("-----------");
	*/
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
		//$("#reqrd_fields_msg").hide();
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
	if( (newCustAllowText == "T") && (newCustCell.length == 0) ){
		validFields = false;
		//$("#needs_cell_msg").show();
		doc.getElementById("needs_cell_msg").style.display = "block";
		$("#new_cust_cell_label").addClass("emptyField");
	}
	else{
		//$("#needs_cell_msg").hide();
		doc.getElementById("needs_cell_msg").style.display = "none";
		$("#new_cust_cell_label").removeClass("emptyField");
	}

	//Same for email and email address
	if( (newCustAllowEmail == "T") && (newCustEmail.length == 0) ){
		validFields = false;
		doc.getElementById("needs_email_msg").style.display = "block";
		$("#new_cust_email_label").addClass("emptyField");
	}
	else{
		doc.getElementById("needs_email_msg").style.display = "none";
		$("#new_cust_email_label").removeClass("emptyField");
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

	//Populate the Customer Name field with this new customer's name
	if(doc.getElementById("make_appt_new_cust").checked) {
		doc.getElementById("customer_name").value = newCustName;	
	}

	//if all fields are valid, then call PHP script to insert data into database
	if(validFields){
		var xmlhttp = createXmlHttpRequestObject();
		xmlhttp.onreadystatechange = function(){
			if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
				var response = xmlhttp.responseText;
				//The PHP script returns the "success" text if successful
				if(response === "success"){
					//closeNewCustomerWindow();
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
		"&birthday="+newCustBirthday+"&notes="+newCustNotes+"&allow_text="+newCustAllowText+"&allow_email="+newCustAllowEmail;
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

/*
-------THIS CAN BE REMOVED---------
This function will validate the data submitted by the user, then 
submit an AJAX request to add an appointment to the Appointments
table in the database, and then call another function to render the appointment on 
the calendar.
*/
function makeAppointment_2(){
	
	//Get fields that the user entered
	var doc = document;
	var customerNameObj = doc.getElementById("customer_name");
	var apptDateInObj = doc.getElementById("date"); 
	var apptTimeObj = doc.getElementById("start-time");
	var apptHoursObj = doc.getElementById("appt-length-hours");
	var apptMinsObj = doc.getElementById("appt-length-mins");
	var apptTitleObj = doc.getElementById("service-dropdown");
	var unavailableStartTime = doc.getElementById("unavailable-start-time");
	var unavailableEndTime = doc.getElementById("unavailable-end-time");
	var unavailableAllDay = doc.getElementById("unavailable-all-day");
	var employeeNameObj = doc.getElementById("employee-dropdown");
	var apptNotesObj = doc.getElementById("notes_area");

	//The formObjects array contains JS objects which need to be checked if they are blank,
	//if they are blank, they have a red border added to their text field.
	//The date, service title, and employee name need to be checked for all types of appointments
	//Different fields need to be checked if blank for different types of appointments (unavailable or non-unavailable)
	var formObjects = [apptDateInObj, apptTitleObj, employeeNameObj];

	//if the appointment type is Unavailable, then need to check the unavailable-start and -end time (only if all-day is NOT checked)
	//if all-day is checked, then the unavailable start/end time fields would be disabled, and the start/end time are set manually
	if(apptTitleObj.value === 'Unavailable'){
		if(!unavailableAllDay.checked){
			formObjects.push(unavailableStartTime);
			formObjects.push(unavailableEndTime);
		}
		else{
			$(unavailableStartTime).removeClass("badField");
			$(unavailableEndTime).removeClass("badField");
		}
	}
	//If the appointment title is NOT Unavailable,
	//then we need to check that the CustomerName, startTime, length-hours, and length-minutes fields are not blank
	else{
		formObjects.push(customerNameObj);
		formObjects.push(apptTimeObj);
		formObjects.push(apptHoursObj);
		formObjects.push(apptMinsObj);
	}

	//Pass the JS objects to the verify function to check if they are blank
	var fieldsLength = verifyAppointmentFieldsLength(formObjects);
	if(fieldsLength){
		var valid = true;
		var errorMessage = '';

		//remove any badField classes (red borders) from any fields
		$(".field_labels input").removeClass("badField");

		//hide make_appt_reqrd_fields_msg if displayed
		var reqrd_fields_msg = doc.getElementById("make_appt_reqrd_fields_msg");
		if(reqrd_fields_msg.style.display != "none"){
			reqrd_fields_msg.style.display = "none";
		}

		var customerName = customerNameObj.value;
		var apptDateIn = apptDateInObj.value; //MM/DD/YYYY
		var apptTime = apptTimeObj.value; //HH:MM AM
		var apptTimeHours = apptHoursObj.value;
		var apptTimeMins = apptMinsObj.value;
		var apptTitle = apptTitleObj.value;	//Note this will be the value of the FIRST service dropdown
		var employeeName = employeeNameObj.value;
		var apptNotes = apptNotesObj.value;

		var unitID = getUnitID(employeeName);
		var apptColor = getApptColor(apptTitle);

		//change format of date
		//Format In: MM/DD/YYYY
		//Format returned: YYYY-MM-DD
		var apptDate = formatDate(apptDateIn);

		//GET ADDITIONAL SERVICES, IF ANY
		//if the service-dropdown-area has any new-service-dropdown children,
		//then get those values and append them to a string, with each
		//service delimited with "|"
		var services = apptTitle;
		var apptTileCal = apptTitle;
		var newServiceChildren = $("#service-dropdown-area").children(".new-service-dropdown");
		if(newServiceChildren.length != 0){
			newServiceChildren.each(function(){
				var additionalService = $(this).children("select").val();
				//only include the additional service if the option selected is not blank
				if(additionalService.length != 0){
					services += "|"+additionalService;
					apptTileCal += ", "+additionalService;
				}
			});
		}

		//console.log("Serivces: " + services);

		//If user selected Unavailable, get the start/end time from the fields
		//If the user selected All Day, start time is 9am, end time is 7:30pm
		//Note apptTitle stores the value entered in the FIRST service dropdown
		if(apptTitle === 'Unavailable') {

			//Set value for customerName to be employeeName so the employee name
			//appears on the calendar for Unavailable, not the customer name
			customerName = employeeName;

			if(unavailableAllDay.checked){
				startTime = "09:00";
				endTime = "19:30";
			}
			else {
				//TO-DO: Make a class in the other JS file to hold these date/time-related functions
				var startTimeEntered = doc.getElementById("unavailable-start-time").value;
				var endTimeEntered = doc.getElementById("unavailable-end-time").value;
				//already verified the startTime and endTime for a non-all-day unavailable appt are not blank

				/*formatTime() returns time entered in military time:
				Input: HH:MM AM/PM
				Output: HH:MM */
				startTime = formatTime(startTimeEntered);
				endTime = formatTime(endTimeEntered);

				//console.log("Unavailable startTime: " + startTime);
				//console.log("Unavailable endTime: " + endTime);

				if(startTime >= endTime){
					//startTime is greater than or equal to endTime
					valid = false;
					$("#unavailable-time-error").show();
				}
				else{
					$("#unavailable-time-error").hide();		
				}
			}
		}
		//If user did not select "Unavailable", then get start time from time field,
		//and determine end time based on the hour(s) and minute(s) the user entered
		//using the up and down arrows next to the time field
		else {
			/*formatTime() returns time entered in military time:
			Input: HH:MM AM/PM
			Output: HH:MM */
			startTime = formatTime(apptTime);

			var hoursNum = parseInt(apptTimeHours);
			var minsNum = parseInt(apptTimeMins);

			//Make sure both hours AND mins are not 0
			//one or the other can be 0, but not both
			if((hoursNum === 0) && (minsNum === 0)){
				valid = false;
				$("#appt-time-error").show();
			}
			else{
				$("#appt-time-error").hide();
				endTime = getEndTime(hoursNum, minsNum, startTime);
			}
		}


		if(valid){
			var xmlhttp = createXmlHttpRequestObject();
			xmlhttp.onreadystatechange = function(){
				if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
					var resultsDiv = document.getElementById("make_appt_results");
					resultsDiv.innerHTML = xmlhttp.responseText;

					/*If none of make_appt_results's child DOM elements contains the make_appt_bad class 
					(which is added to any of the error messages, if the customer does not exists for example), 
					then fields are okay, so render appointment on calendar.*/
					var msgs = $("#make_appt_results").find(".make_appt_bad");
					if(msgs.length === 0){
						//date needs to be in the original format (MM/DD/YYYY) when rendering
						//The apptDateIn variable is in this format
						renderCalendarAppt(apptDateIn, startTime, endTime, apptColor, apptTileCal, apptNotes, customerName, unitID);

						//Clear fields
						clearAppointmentFields();
					}
				}
			}

			xmlhttp.open("POST", "make_appointment.php", true);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			var params = "date="+apptDate+"&customerName="+customerName+"&startTime="+startTime+
						"&endTime="+endTime+"&employeeName="+employeeName+"&services="+services+"&notes="+apptNotes;
																	
			xmlhttp.send(params);
			//encodeURIComponent()
		}
	}
	else{
		console.log("Fields are empty");
		$("#make_appt_reqrd_fields_msg").show();
		valid = false;
		errorMessage = "Fields are blank";
	}
}