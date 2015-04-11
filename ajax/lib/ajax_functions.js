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

	//TO-DO: if nameEntered is blank, then display the "no customer found" window
	//currently returns all customers in window

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
This function will submit an AJAX request to add an appointment to the Appointments
table in the database, and then call another function to render the appointment on 
the calendar.
*/
function makeAppointment(){
	
	//Get fields that the user entered
	var doc = document;
	var customerNameObj = doc.getElementById("customer_name");
	var apptDateInObj = doc.getElementById("date"); 
	var apptTimeObj = doc.getElementById("start-time");
	var apptTitleObj = doc.getElementById("service-dropdown");
	var employeeNameObj = doc.getElementById("employee-dropdown");
	var apptNotesObj = doc.getElementById("notes_area");

	//var formObjects = [customerNameObj, apptDateInObj, apptTimeObj, apptTitleObj, employeeNameObj];
	var formObjects = [apptDateInObj, apptTimeObj, apptTitleObj, employeeNameObj];

	//If the appointment title is NOT Unavailable,
	//then we need to check that the CustomerName is not blank
	if(apptTitleObj.value != 'Unavailable'){
		formObjects.push(customerNameObj);
	}

	//Pass the JS objects to the verify function (except Notes since it does not have to be validated)
	var fieldsLength = verifyAppointmentFieldsLength(formObjects);
	if(fieldsLength){

		//hide make_appt_reqrd_fields_msg
		var reqrd_fields_msg = doc.getElementById("make_appt_reqrd_fields_msg");
		if(reqrd_fields_msg.style.display != "none"){
			reqrd_fields_msg.style.display = "none";
		}

		var customerName = customerNameObj.value;
		var apptDateIn = apptDateInObj.value; //MM/DD/YYYY
		var apptTime = apptTimeObj.value; //HH:MM AM
		var apptTitle = apptTitleObj.value;
		var employeeName = employeeNameObj.value;
		var apptNotes = apptNotesObj.value;

		var unitID = getUnitID(employeeName);
		var apptColor = getApptColor(apptTitle);

		//change format of date
		var apptDate = formatDate(apptDateIn);

		//If user selected Unavailable, get the start/end time from the fields
		//If the user selected All Day, start time is 9am, end time is 7:30pm
		if(apptTitle === 'Unavailable') {

			//Set value for customerName to be employeeName so the employee name
			//appears on the calendar for Unavailable, not the customer name
			customerName = employeeName;

			if(doc.getElementById("unavailable-all-day").checked){
				startTime = "09:00";
				endTime = "19:30";
			}
			else {
				//TO-DO: Make a class in the other JS file to hold these date/time-related functions
				startTime = formatTime(doc.getElementById("unavailable-start-time").value);
				endTime = formatTime(doc.getElementById("unavailable-end-time").value);

				//Show error if start time is greater than end time
				//i.e start:12pm end:10am
				//User is entering start and end time here
			}
		}
		//If user did not select "Unavailable", then get start time from time field,
		//and determine end time based on appointment title
		else {
			//startTime comes from what the user enters
			startTime = formatTime(apptTime);
			
			//end time is determined based on appointment
			endTime = getEndTime(apptTitle, startTime);
		}

		var xmlhttp = createXmlHttpRequestObject();
		xmlhttp.onreadystatechange = function(){
			if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
				var resultsDiv = document.getElementById("make_appt_results");
				resultsDiv.innerHTML = xmlhttp.responseText;

				/*If none of make_appt_results's child DOM elements contains the make_appt_bad class 
				(which is added to any of the error messages), then fields are okay,
				then render appointment on calendar.*/
				var msgs = $("#make_appt_results").find(".make_appt_bad");
				if(msgs.length === 0){
					//date needs to be in the original format (MM/DD/YYYY) when rendering
					renderCalendarAppt(apptDateIn, startTime, endTime, apptColor, apptTitle, customerName, unitID);

					//Clear fields
					clearAppointmentFields();
				}
			}
		}

		xmlhttp.open("POST", "make_appointment.php", true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		var params = "date="+apptDate+"&customerName="+customerName+"&startTime="+startTime+
					"&endTime="+endTime+"&employeeName="+employeeName+"&service="+apptTitle+"&notes="+apptNotes;

		xmlhttp.send(params);
		//encodeURIComponent()
	}
	else{
		//console.log("Fields are empty");
		$("#make_appt_reqrd_fields_msg").show();
	}
}