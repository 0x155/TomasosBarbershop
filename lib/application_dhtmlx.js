$(document).ready(function(){

	//JavaScript to set up the DHTMLX Scheduler
	//scheduler.locale.labels.unit_tab = "Unit";
	scheduler.createUnitsView({
	    name:"unit",
	    property:"unit_id", //the mapped data property
	    //True so events not assigned to a unit will not be displayed.
	    //Otherwise, incorrect events would go to the first unit
	    skip_incorrect: true, 
	    list:[              //defines the units of the view
	        {key:1, label:"Kieron"},
	        {key:2, label:"Tiara"},
	        {key:3, label:"Doug"},
	        {key:4, label:"Melvin"},
	        {key:5, label:"Jackie"}
	    ]
	});

	//NOTE: config info such as this must come before the init method
	scheduler.config.first_hour = 9;
	scheduler.config.last_hour = 20;
	
	//Change hour scale to 12-hours instead of Military
	scheduler.config.hour_date = "%h:%i %A";

	//Change height of the hour scale
	scheduler.config.hour_size_px = 176;

	//formats Date at the top of calendar
	scheduler.config.default_date = "%l %F %j";

	//-----Adding 15min time interval on y-axis---------
	//date_to_str returns a function which converts a Date object to the specified format
	var hour_format = scheduler.date.date_to_str("%h:%i %A");
	var step = 15; //15 min interval
	scheduler.templates.hour_scale = function(date){
		var html = "";
		for(var i = 0; i < (60/step); i++) {
			html += "<div style='height:40px;line-height:40px'>"+hour_format(date)+"</div>";

			//adds 15 mins to the date
			date = scheduler.date.add(date, step, "minute");
		}
		return html;
	};

	//recommended to put all custom templates inside onTemplatesReady() event
	//http://docs.dhtmlx.com/scheduler/api__scheduler_ontemplatesready_event.html

	//Initialize scheduler
	//See if format of date displayed on top can be changed
	scheduler.init('scheduler_here', new Date(), "unit");

	//Add events to calendar
	//Will eventually load data from a database:
	//http://docs.dhtmlx.com/scheduler/loading_data.html#loadingdatafromadatabase
	var events = [
		{start_date:"03/21/2015 10:30", end_date:"03/21/2015 11:00", text:"Haircut -- Joe Smith", color:"#3A87AD", unit_id:"1"},
		{start_date:"03/21/2015 09:00", end_date:"03/21/2015 09:30", text:"Haircut -- Christian", color:"#3A87AD", unit_id:"1"},
		{start_date:"03/21/2015 12:00", end_date:"03/21/2015 12:30", text:"Shave -- Dylan", color: "#FF887C", unit_id:"1"},
	    {start_date:"03/21/2015 09:30", end_date:"03/21/2015 10:00", text:"Color -- Jane Doe", color:"#F58839", unit_id:"2"},
	    {start_date:"03/21/2015 12:30", end_date:"03/21/2015 12:45", text:"Eyebrow Wax -- Jane Doe", color: "#C353E8", unit_id:"2"},
	    {start_date:"03/21/2015 11:00", end_date:"03/21/2015 11:15", text:"Beard Trim -- Jonathan", color:"#368C23", unit_id:"2"},
	    {start_date:"03/21/2015 12:30", end_date:"03/21/2015 13:00", text:"Haircut -- Dylan", color:"#3A87AD", unit_id:"3"},
	    {start_date:"03/21/2015 09:30", end_date:"03/21/2015 10:00", text:"Color -- Jane Doe", color:"#F58839", unit_id:"5"}
	];

	scheduler.parse(events,"json");

	/* When search button is clicked, move other fields down and
	show information based on search results. 
	1.) If search returns a match, display customer history and information
	2.) If partial match, return top results and ask user which to choose
	3.) If no matches, ask user if they want to add new customer */
	$('#cust-search-button').click(function() {
		var customerName = document.getElementById("customer_name").value;

		/*For demo purposes, if the customerName entered is Christian,
		then bring up customer history screen with my name */
		if(customerName === "Christian"){
			$(".customer-history").show(300);
			document.getElementById("customer-history-label").innerHTML = customerName;
		}
		/* Else, if anything else is entered, then display 
		modal_wrapper_cust_search_results window.*/
		else if(customerName.length > 0){
			//try setting visibility using JS here instead of JQuery
			$("#modal_wrapper_cust_search_results").css("visibility", "visible");
			document.getElementById("cust_search_name").innerHTML = customerName;
		}
		//If nothing is entered, then display no customer returned window.
		//This will prompt the user if they want to add a new customer.
		else {
			$("#no-customer-returned").show(300);
		}
	});

	/* This closes the window showing customer history and informaton */
	$('#cust-history-close').click(function(){
		$(".customer-history").hide(300);
	});

	/* If user does not want to add new customer, close no-customer-returned window */
	$('#no-cust-btn-no').click(function(){
		$("#no-customer-returned").hide(300);
	});

	//Sets up the DatePicker for the appointment
	//The new customer birthday field wil also use DatePicker, but will be
	//configured differently
	$('#date').datepicker({
		todayBtn:"linked",
		autoclose:true,
		todayHighlight:true,
		daysOfWeekDisabled:'0'
	});

	//DatePicker for new customer's birthday when adding a new customer
	$('.new_cust_birthday_field').datepicker({
		format:"MM dd",
		startView: "year",
		todayBtn:"linked",
		autoclose:true,
		todayHighlight:true
	});
	//Pre-fill the datepicker with today's date
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1; //Jan = 0
	var year = today.getFullYear();
	$('#date').datepicker('update', month+"/"+day+"/"+year);


	//Time Picker
	$('.appt-timepicker').timepicker();

	/* If user selects "Unavailable" from service dropdown,
	show fields to enter start/end time employee is unavailable, or All-Day checkbox.
	Also disable the appointment start-time fields and customer name field to not confuse user. */
	$('select[name=service]').change(function(){
		var selection = document.getElementById("service-dropdown").value;
		if(selection === 'Unavailable'){
			$("#unavailable-service").show(300);

			//disable other Time field so user does not get confused
			document.getElementById("start-time").disabled = true;
			document.getElementById("customer_name").disabled = true;
			document.getElementById("cust-search-button").disabled = true;
		}
		else {
			$("#unavailable-service").hide(300);
			document.getElementById("start-time").disabled = false;
			document.getElementById("customer_name").disabled = false;
			document.getElementById("cust-search-button").disabled = false;
		}
	});

	/* If the user selects Unavailable from service dropdown, then checks the "All Day"
	check box, then disable the start and end time fields */
	$("#unavailable-all-day").change(function(){
		if(document.getElementById("unavailable-all-day").checked){
			document.getElementById("unavailable-start-time").disabled = true;
			document.getElementById("unavailable-end-time").disabled = true;
		}
		else if (!(document.getElementById("unavailable-all-day").checked)){
			document.getElementById("unavailable-start-time").disabled = false;
			document.getElementById("unavailable-end-time").disabled = false;
		}
	});

	/* This method will display appointment on calendar when the "Make Appointment" button is
	clicked. */
	$('.make_appt_btn').click(function(event){ 
		//This will prevent the page from reloading when button is clicked
		event.preventDefault();

		var doc = document;

		//Get fields that user entered. These will be used to create event in database
		var customerName = doc.getElementById("customer_name").value;
		var apptDateIn = doc.getElementById("date").value; //MM/DD/YYYY
		var apptTime = doc.getElementById("start-time").value; //HH:MM AM
		var apptTitle = doc.getElementById("service-dropdown").value;
		var employeeName = doc.getElementById("employee-dropdown").value;

		var startTime = '';
		var endTime = '';

		var unitID = getUnitID(employeeName);
		var apptColor = getApptColor(apptTitle);

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

		//Add appointment to calendar
		var appt = [
			{start_date:apptDateIn + " " + startTime, end_date:apptDateIn + " " + endTime, color:apptColor, text:apptTitle + " -- " + customerName, unit_id:unitID}
			//{start_date:"01/31/2015 11:00", end_date:"01/31/2015 11:30", text:"Haircut", unit_id:"1"}
		];

		scheduler.parse(appt,"json");
	});

	/*
	If the user selects the "Does this customer have children?" checkbox,
	then display the inline fields to add each child. Width of the new customer window
	needs to be modified to display these fields.
	*/
	//TO-DO: change this to onchange="funcName()" on new_cust_has_children checkbox
	$('input[name=newCustHasChildren]').change(function(){
		var newCustModal = document.getElementById("modal_new_customer");
		//If checked, then display fields
		if(this.checked){
			//change width of new customer modal screen so all inline fields can be displayed
			$("#modal_new_customer").animate({maxWidth: "1000px"}, 400);
			$(".add_new_cust_child_fields").show();
		}
		//Else, hide
		else {
			clearNewCustChildLines();
		}
	});
	
});

/*
This Javascript function will open or close the Add New Customer modal window,
depending on whether it is currently open or close.
*/
function toggleAddNewCustomerWindow(){
	var modalWrapperNewCust = document.getElementById("modal_wrapper_new_customer");
	//var modalWrapperNewCust = document.getElementById("modal_wrapper").style.visibility;
	//above wont work and i dont know why

	//if the window is being hidden, also need to clear fields on the Add New Customer window
	if(modalWrapperNewCust.style.visibility === "visible"){
		modalWrapperNewCust.style.visibility = "hidden";
		clearAddNewCustomerFields();
		//remove customer child lines if they appear goes here
		clearNewCustChildLines();
		document.getElementById("no-customer-returned").style.display = "none";
	}
	else{
		modalWrapperNewCust.style.visibility = "visible";	
	}
}

/*
This function will validate the information the user entered
when adding a new customer. Used below link as a reference
http://www.w3schools.com/js/js_validation.asp
*/
function addNewCustomer() {
	//event.preventDefault();
	var validFields = true;

	var doc = document;
	var newCustName = doc.getElementById("new_cust_name").value;
	var newCustCell = doc.getElementById("new_cust_cell_phone").value;
	var newCustEmail = doc.getElementById("new_cust_email").value;

	if(newCustName.length === 0){
		$("#new_cust_name_label").addClass("emptyField");
		validFields = false;
		$("#reqrd_fields_msg").show();
	}
	if(newCustCell.length === 0) {
		$("#new_cust_cell_label").addClass("emptyField");
		validFields = false;	
		$("#reqrd_fields_msg").show();
	}

	//TO-DO: Also verify if phone number contains 10 digits
	//Not sure how cell number will be stored yet for texting feature
	//Can use regex

	//Check that email address contains an "@" symbol and a dot ".",
	//if user entered one (Email address is not a required field)
	if(newCustEmail.length > 0){
		var atSymbol = newCustEmail.indexOf("@");
		var dot = newCustEmail.indexOf(".");
		if( (atSymbol === -1) || (dot === -1) ) {
			$("#new_cust_email_label").addClass("emptyField");
			validFields = false;
			$("#invalid_email_msg").show();
		}
	}

	//TO-DO: Prefill new customers name in the appointment being scheduled
	//so the user wont have to enter the new customer's name again
	if(doc.getElementById("make_appt_new_cust").checked) {
		doc.getElementById("customer_name").value = newCustName;	
	}

	//return validFields;
	//if all fields are valid, then close form
	if(validFields){
		toggleAddNewCustomerWindow();
	}
}

/*
This function clears all fields in the Add New Customer window.
This is run when the user closes the form, not submitting any data.
*/
function clearAddNewCustomerFields(){
	//clear all input fields
	$("#new_customer_table input").val("");
	$("#new_customer_table textarea").val("");

	//uncheck all checkboxes
	$("#new_customer_table input").prop("checked", false);
	
	//$("#make_appt_new_cust").prop("checked", false);
	$(".new_cust_more_fields input").prop("checked", false);

	//hide the error messages that may have come up
	$("#reqrd_fields_msg").hide();
	$("#invalid_email_msg").hide();

	//remove the emptyField class from any items that may have had it added
	$("label[class='emptyField']").removeClass("emptyField");
}

/*
This function will add a new line item for adding children for a customer.
When a user is adding a customer with children, they click a plus sign to 
add another line for another new child to add.
*/
function addNewCustChildLine(){

	//Need to make a clone of this class since append(cls) will remove cls from its original DOM location
	//http://cha1tanya.com/2014/01/18/jquery-append-and-clone.html
	//cloning the first element allows only one copy to be made
	$(".add_new_cust_child_fields").first().clone().appendTo(".new_cust_more_fields");
	//appendChild and cloneNode are the native JS methods to do this
}

/*
This function clears the lines for each of the new customer's child information.
*/
function clearNewCustChildLines(){
	$(".add_new_cust_child_fields").hide();
	$("#modal_new_customer").animate({maxWidth: "675px"}, 400);

	//Need to remove all of these DOM elements except the first one
	//so that the next time the user checks "Do they have children?"
	//the same number of fields dont show up
	$(".add_new_cust_child_fields").not(":first").remove();	
}

/*
Closes the modal wrapper for the customer search results window.
May be able to do this through toggling, like the Add Customer window.
*/
function closeCustSearchResults(){
	var custSearchModal = document.getElementById("modal_wrapper_cust_search_results");
	custSearchModal.style.visibility = "hidden";

	//uncheck all radio buttons
	$("#cust_search_results_table input").prop("checked", false);
	$("#no_cust_selected_msg").hide();
}

/*
This function will take the customer selected via radio button on the 
customer search results screen, and populate it in the Customer Name
field on the main screen
*/
function selectCustomer(){
	//if the user has chosen a customer, get the value
	var customerName = $("#cust_search_results_table input:checked").val();
	if(customerName){
		//Close search results window (closeCustSearchResults())
		closeCustSearchResults();

		//Populate customer name field with selected name
		document.getElementById("customer_name").value = customerName;
	}
	else{
		//if no radio button is selected, display message
		$("#no_cust_selected_msg").show(300);
	}
}

/*
This will format the appointment time into the form accepted by the calendar
Input: HH:MM AMPM
Output: HH:MM
Note the time returned needs to be in Military time
This method will call another method to convert to Military time if 
the timeIn is a PM time
*/
function formatTime(timeIn) {
	var space = timeIn.indexOf(' ')
	var AMorPM = timeIn.substr(space + 1);
	var h = timeIn.indexOf(':');
	var hour = timeIn.substring(0, h);
	var minutes = timeIn.substr(h + 1, 2);

	var ret = '';
	//convert to Military time if PM time
	if(AMorPM === 'PM') {
		ret = convertToMilitaryTime(timeIn.substring(0, space));
	}
	else {
		//console.log("Time In: " + timeIn);
		//hour needs to be 2 digits (HH)
		//prepend 0 to hour if length is 1
		//console.log("Hour: " + hour + "Length: " + hour.length);
		if(hour.length === 1) {
			timeIn = "0" + timeIn;

			//need to redefine space index since we added a character
			space = timeIn.indexOf(' ');
			ret = timeIn.substring(0, space);
		}
		//if time entered is 12AM, change hours to 00
		else if(hour === '12') {
			hour = '00'
			ret = hour + ":" + minutes;
		}
		else {
			ret = hour + ":" + minutes;
		}
	}
	//console.log("returned time: " + ret);
	return ret;
}

/*
Converts time entered to Military time.
Note this should only be called for PM times.
Input: 2:30
Output: 14:30
*/
function convertToMilitaryTime(timeIn) {
	var h = timeIn.indexOf(':');
	var hour = timeIn.substring(0, h);
	var minutes = timeIn.substr(h + 1);
	var ret = '';

	//specify base 10 since older browsers may convert a number starting with 0 to octal base
	var hourNum = parseInt(hour, 10);

	//if hour is 12, then do not add 12 to it.
	//i.e 12:30pm is 12:30 in Military time
	if(hourNum === 12) {
		ret = timeIn;
	}
	//if any other hour, then add 12 to it
	//i.e 1:00pm -> 13:00
	else {
		hour = (hourNum + 12).toString();
		ret = hour + ":" + minutes;
	}

	return ret;
}

/*
This function will return the end time of an appointment based on type of service
Haircut = 30 mins
Beard Trim = 15 mins
Shave = 30 mins
Color = 30 mins
Eyebrow Wax = 15 mins

startTime needs to be in Military time (i.e 09:00, 14:30) 
*/
function getEndTime(service, startTime){
	switch(service) {
		case "Haircut":
			return addMilitaryTime(30, startTime);
		case "Beard Trim":
			return addMilitaryTime(15, startTime);
		case "Shave":
			return addMilitaryTime(30, startTime);
		case "Color":
			return addMilitaryTime(30, startTime);
		case "Eyebrow Wax":
			return addMilitaryTime(15, startTime);
	}
}

/*
This function will return a new military time with length added to it
*/
function addMilitaryTime(length, startTime) {
	var h = startTime.indexOf(':');
	var hourNum = parseInt(startTime.substring(0, h), 10);
	var minutesNum = parseInt(startTime.substr(h + 1), 10);

	var hours = '';
	var mins = '';
	var newMinutes = length + minutesNum;
	if(newMinutes >= 60) {
		var dif = newMinutes - 60;
		hourNum += 1;
		hours = hourNum.toString();
		mins = dif.toString();
	}
	else {
		hours = hourNum.toString();
		mins = newMinutes.toString();
	}

	//if hours or minutes is 1 digit, need to prepend 0
	//This prevents time such as 10:0 and 9:0
	if(mins === '0') {
		mins = "0" + mins;
	}
	if(hours.length === 1) {
		hours = "0" + hours;
	}

	return hours + ":" + mins;
}

/*
Return the ID of the employee which this appointment is for.
This UnitID is used to add the event for a particular column (employee)
in the calendar
*/
function getUnitID(employeeName) {
	switch(employeeName){
		case "Kieron":
			return 1;
		case "Tiara":
			return 2;
		case "Doug":
			return 3;
		case "Melvin":
			return 4;
		case "Jackie":
			return 5;
	}
}

/*
Returns the color of the event to appear on the calendar, based on
the title of the appointment (Haircut, Shave, etc.)
*/
function getApptColor(apptTitle) {
	switch(apptTitle) {
		case "Haircut":
			return "#3A87AD";
		case "Beard Trim":
			return "#368C23";
		case "Shave":
			return "#FF887C";
		case "Color":
			return "#F58839";
		case "Eyebrow Wax":
			return "#C353E8";
		case "Unavailable":
			return "#F45245";
		default:
			return "#3A87AD";
	}
}