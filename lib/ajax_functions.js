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
			//ret returns as just a string, parse() turns it into a JSON object
			//so the properties can be accessed
			var data = JSON.parse(response);
			if(data.hasOwnProperty("Error_Msgs")){
				var resultsDiv = document.getElementById("make_appt_results");
				resultsDiv.innerHTML = data.Error_Msgs;
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
This function will return the list of services in a given appointment
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
This is called when the user changes the services for an appointment.
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
This function will insert the service(s) for each appointment into the
Appointment_Services table. This is done to normalize the database,
since one appointment can contain many services.

function addToServices(servicesIn){
	var xmlhttp = createXmlHttpRequestObject();

	//This function is fired after each stage of the AJAX request
	//if condition is checking the state of the request
	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			var response = xmlhttp.responseText;

		}
	}
	xmlhttp.open("POST", "add_services.php", true);

	//indicates the type of data you are sending
	//most servers will determine the data type, but good practice to set this
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var param = "services="+servicesIn;
	xmlhttp.send(param);	
}
*/

/*
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