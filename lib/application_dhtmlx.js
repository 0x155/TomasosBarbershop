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
	scheduler.config.last_hour = 21;
	
	//Change hour scale to 12-hours instead of Military
	scheduler.config.hour_date = "%h:%i %A";

	//-----Adding 15min time interval on y-axis---------
	//date_to_str returns a function which converts a Date object to the specified format
	var hour_format = scheduler.date.date_to_str("%h:%i %A");
	var step = 15; //15 min interval
	scheduler.templates.hour_scale = function(date){
		var html = "";
		for(var i = 0; i < (60/step); i++) {
			html += "<div style='height:21px;line-height:21px;padding-bottom:1em'>"+hour_format(date)+"</div>";

			//adds 15 mins to the date
			date = scheduler.date.add(date, step, "minute");

			//This adds the intervals, but need to make dhx_scale_hour bigger
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
		{start_date:"01/24/2015 03:00", end_date:"01/24/2015 04:00", text:"Haircut", unit_id:"1"},
	    {start_date:"01/24/2015 09:00", end_date:"01/24/2015 10:00", text:"Color", color:"#F58839", unit_id:"5"},
	    {start_date:"01/24/2015 10:00", end_date:"01/24/2015 11:00", text:"Haircut", unit_id:"5"},
	    {start_date:"01/24/2015 05:00", end_date:"01/24/2015 06:00", text:"Haircut", unit_id:"3"}
	];

	scheduler.parse(events,"json");

	/* When search button is clicked, move other fields down and
	show information based on search results. 
	1.) If search returns a match, display customer history and information
	2.) If partial match, return top results and ask user which to choose
	3.) If no matches, ask user if they want to add new customer */
	$('.cust-search-button').click(function() {
		var customerName = document.getElementById("customer_name").value;

		if(customerName.length > 0){
			$(".customer-history").show(300);
			document.getElementById("customer-history-label").innerHTML = customerName;
		}
		else {
			$("#no-customer-returned").show(300);
		}
	});

	/* This closes the window showing customer history and informaton */
	$('#cust-history-close').click(function(){
		$(".customer-history").hide(300);
	});

	/*
	If the user selects Yes (they do want to add a new customer), do you want users to still make the 
	appointment, or first add the customer by getting their info, then make the appointment ?
	*/
	$('#no-cust-btn-yes').click(function(){
		
	});

	/* If user does not want to add new customer, close no-customer-returned window */
	$('#no-cust-btn-no').click(function(){
		$("#no-customer-returned").hide(300);
	});

	//Sets up the Date Picker
	$('.datepicker').datepicker({
		todayBtn:"linked",
		autoclose:true,
		todayHighlight:true,
		daysOfWeekDisabled:'0'
	});
	//Pre-fill the datepicker with today's date
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1; //Jan = 0
	var year = today.getFullYear();
	$('.datepicker').datepicker('update', month+"/"+day+"/"+year);

	//Time Picker
	$('.appt-timepicker').timepicker();

	/* If user selects "Unavailable" from service dropdown,
	show fields to enter start/end time employee is unavailable, or All-Day checkbox */
	$('select[name=service]').change(function(){
		var selection = document.getElementById("service-dropdown").value;
		if(selection === 'Unavailable'){
			$("#unavailable-service").show(300);

			//disable other Time field so user does not get confused
			$("#start-time").prop("disabled", true);
		}
		else {
			$("#unavailable-service").hide(300);
			$("#start-time").prop("disabled", false);
		}
	});

	/* If the user selects Unavailable from service dropdown, then checks the "All Day"
	check box, then disable the start and end time fields */
	$("#unavailble-all-day").change(function(){
		if($('#unavailble-all-day').prop('checked')){
			$("#unavailable-start-time").prop("disabled", true);
			$("#unavailable-end-time").prop("disabled", true);
		}
		else if(!$('#unavailble-all-day').prop('checked')) {
			$("#unavailable-start-time").prop("disabled", false);	
			$("#unavailable-end-time").prop("disabled", false);	
		}
	});

	/* This method will display appointment on calendar when the "Make Appointment" button is
	clicked. */
	$('.make_appt_btn').click(function(event){ 
		//This will prevent the page from reloading when button is clicked
		event.preventDefault();

		//Get fields that user entered. These will be used to create event in database
		var customerName = document.getElementById("customer_name").value;
		var apptDateIn = document.getElementById("date").value; //MM/DD/YYYY
		var apptTime = document.getElementById("start-time").value; //HH:MM AM
		var apptTitle = document.getElementById("service-dropdown").value;
		var employeeName = document.getElementById("employee-dropdown").value;

		console.log("Customer Name:" + customerName);
		console.log("Appt Date:" + apptDateIn);
		console.log("Appt Start Time:" + apptTime);
		console.log("Appt Tile:" + apptTitle);

		var startTime = '';
		var endTime = '';


		/* If user selected Unavailable, get the start/end time from the fields.
		If the user selected All Day, start time is 9am, end time is 7:30pm. */
		if(apptTitle === 'Unavailable') {
			if($('#unavailble-all-day').prop('checked')){
				console.log("Unavailable all day selected");
				startTime = "09:00";
				endTime = "19:30";
			}
			else {
				//startTime = formatTime(document.getElementById("unavailable-start-time").value);
				//endTime = formatTime(document.getElementById("unavailable-end-time").value);

				startTime = document.getElementById("unavailable-start-time").value;
				endTime = document.getElementById("unavailable-end-time").value;

				//Show error if start time is greater than end time
				//i.e start:12pm end:10am
			}
			console.log("Unavailable start: " + startTime);
			console.log("Unavailable end: " + endTime);
		}
		//If user did not select "Unavailable", then use start/end time from other fields
		else {
			startTime = apptTime;
			//figure out end time
		}
	});
	
});

/*
This function takes in a date that is generated by the DatePicker.
The date argument needs to be converted to the format accepted by the event object
for the calendar.
The argument is in the following form: MM/DD/YYYY
The return value is in the following form: YYYY-MM-DD
*/
function formatDate(dateIn) {	
	var x = dateIn.indexOf('/');
	var y = dateIn.lastIndexOf('/');

	var month = dateIn.substring(0, x);
	var day = dateIn.substr((x + 1), 2);
	var year = dateIn.substr(y + 1);

	return year + "-" + month + "-" + day;
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
		console.log("Time In: " + timeIn);
		//hour needs to be 2 digits (HH)
		//prepend 0 to hour if length is 1
		console.log("Hour: " + hour + "Length: " + hour.length);
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
	console.log("returned time: " + ret);
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

startTime will be in Military time (i.e 09:00, 14:30) 
*/
function getEndTime(service, startTime){

	var endTime = '';

	if(service === 'Haircut'){
		endTime = addMilitaryTime(30, startTime);
	}
	else if(service === 'Beard Trim'){
		endTime = addMilitaryTime(15, startTime);
	}
	else if(service === 'Shave'){
		endTime = addMilitaryTime(30, startTime);
	}
	else if(service === 'Color'){
		endTime = addMilitaryTime(30, startTime);
	}
	else if(service === 'Eyebrow Wax'){
		endTime = addMilitaryTime(15, startTime);
	}

	return endTime;
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