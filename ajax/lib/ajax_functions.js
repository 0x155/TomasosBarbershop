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
This function will submit an AJAX request to add an appointment to the Appointments
table in the database, and then call another function to render the appointment on 
the calendar.
*/
function makeAppointment(){
	console.log("Enter makeAppointment function");
	
	var doc = document;

	//Get fields that the user entered
	var customerName = doc.getElementById("customer_name").value;
	var apptDateIn = doc.getElementById("date").value; //MM/DD/YYYY
	var apptTime = doc.getElementById("start-time").value; //HH:MM AM
	var apptTitle = doc.getElementById("service-dropdown").value;
	var employeeName = doc.getElementById("employee-dropdown").value;
	var apptNotes = doc.getElementById("notes_area").value;

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

	/*
	console.log("---Results from makeAppointment()---");
	console.log("Customer: " + customerName);
	console.log("Date: " + apptDate);
	console.log("Start Time: " + startTime);
	console.log("End Time: " + endTime);
	console.log("Employee: " + employeeName);
	console.log("Title: " + apptTitle);
	console.log("Notes: " + apptNotes);
	*/
	var xmlhttp = createXmlHttpRequestObject();
	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			var resultsDiv = document.getElementById("make_appt_results");
			resultsDiv.innerHTML = xmlhttp.responseText;

			//call another function to render appointment
		}
	}

	xmlhttp.open("POST", "make_appointment.php", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "date="+apptDate+"&customerName="+customerName+"&startTime="+startTime+
				"&endTime="+endTime+"&employeeName="+employeeName+"&service="+apptTitle+"&notes="+apptNotes;

	xmlhttp.send(params);
	//encodeURIComponent()

}
