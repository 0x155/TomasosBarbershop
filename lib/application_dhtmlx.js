//global DataProcessor variable
//DataProcessor allows for events to be updated/added/deleted
var dp;
$(document).ready(function(){

	//Sets up the DatePicker for the appointment
	//The new customer birthday field wil also use DatePicker, but will be
	//configured differently
	$('.appt-date-picker').datepicker({
		todayBtn:"linked",
		autoclose:true,
		todayHighlight:true,
		disableTouchKeyboard:true,
		keyboardNavigation:false,
		daysOfWeekDisabled:'0'
	}).on('changeDate', function(e){
		//change date of calendar to date selected
		scheduler.setCurrentView(e.date);
	});
	//Pre-fill the datepicker with today's date
	var today = new Date();
	$('#date').datepicker('update', today);

	/*
	This is the datepicker displayed at the top of the calendar.
	The on changeDate event changes the date displayed in the scheduler 
	to the date the user selects. This allows the user to pick a date to view
	instead of using the arrows and/or Today button.
	Also, when the datepicker is closed, it resets to start with the current date
	the next time it is opened.
	*/
	$("#go-to-date-picker").datepicker({
		todayBtn:"linked",
		autoclose:true,
		todayHighlight:true,
		disableTouchKeyboard:true,
		keyboardNavigation:false,
		daysOfWeekDisabled:'0'
	}).on('changeDate', function(e){
		//change date of calendar to date selected
		scheduler.setCurrentView(e.date);
	}).on('hide', function(e){
		//set back to the current date when datepicker is closed
		$("#go-to-date-picker").datepicker('update', today);
	});

	//DatePicker for new customer's birthday when adding a new customer
	$('.new_cust_birthday_field').datepicker({
		format:"MM dd",
		startView: "year",
		todayBtn:"linked",
		autoclose:true,
		todayHighlight:true,
		keyboardNavigation:false,
		disableTouchKeyboard:true
	});

	//Time Picker
	$('.appt-timepicker').timepicker({
		disableFocus: true,
		disableMousewheel: true
	});


	//JavaScript to set up the DHTMLX Scheduler
	//scheduler.locale.labels.unit_tab = "Unit";
	scheduler.createUnitsView({
	    name:"unit",
	    property:"Unit_ID", //the name of a data property that will be used to assign events to certain units

	    //True so events not assigned to a unit will not be displayed.
	    //Otherwise, incorrect events would go to the first unit
	    skip_incorrect: true, 
	    
	    /*
	    list:[              
	        {key:1, label:"Kieron"},
	        {key:2, label:"Tiara"},
	        {key:3, label:"Doug"},
	        {key:4, label:"Melvin"},
	        {key:5, label:"Jackie"}
	    ]
	    */
	    //gets list from PHP script
	    list:scheduler.serverList("Unit_ID")
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

	//changes the format of the date when parsing
	//The expected format of the calendar is MM/DD/YYYY, but the
	//format in the database is YYYY-MM-DD HH:MM:SS
	scheduler.config.xml_date = "%Y-%m-%d %H:%i:%s";

	//sets the format for the start_time and end_time properties when addEvent is called
	scheduler.config.api_date = "%m/%d/%Y %H:%i";

	//Brings up the light box when you double click on an event in the calendar
	scheduler.config.details_on_dblclick=true;

	//shows a spinning logo while the data loads
	scheduler.config.show_loading = true;

	//Does not allow user to drag or move events on calendar
	//may change later
	scheduler.config.drag_move = false;

	//sets the time interval when double clicking on empty cells
	scheduler.config.time_step = 15;

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

	scheduler.templates.quick_info_content = function(start, end, ev){ 
       return ev.Notes;
	};

	//TO-DO: Display better message to user than alert window
	//Either modal window or error message under Make Appointment button
	//NOTE: when there is a collision, the event is not added, but the fields are cleared,
	//the data the user entered will be cleared if they try to schedule the appointment.
	//NOTE: also, after an event collision, the native_editor_status is set to undefined
	scheduler.attachEvent("onEventCollision", function (ev, evs){
		//console.log("--COLLISION-- Event: " + ev.id);
		alert("Note: There is already an appointment scheduled for that time");
		//scheduler.deleteEvent(ev.id);
		return true;
	});

  	scheduler.attachEvent("onEventAdded", function(id,ev){
	    console.log("Scheduler - Event added. New event ID: " + ev.id);
	    //clearAppointmentFields(); --?
	});

  	scheduler.attachEvent("onEventDeleted", function(id){
	    console.log("Scheduler - Event DELETED. ID: " + id);
	});	

	scheduler.attachEvent("onEventChanged", function(id,ev){
	    console.log("Scheduler - Event changed. ID: " + id + "  UnitID: " + ev.Unit_ID);
	});

	//When the date is changed on the calendar,
	//set the date for the datepicker to this new date
	scheduler.attachEvent("onViewChange", function (new_mode , new_date){
	    $('#date').datepicker('update', new_date);
	});

	scheduler.attachEvent("onEmptyClick", function (date, e){
       //set the time in the time-picker to the time the user selected in the empty cell
       $('#start-time').timepicker('setTime', date);
	});

	scheduler.attachEvent("onEventIdChange", function(old_id,new_id){
    	console.log("EventID changed");
    	console.log("OLD ID: " + old_id + ",  New ID: " + new_id);
	});

	scheduler.attachEvent("onLightbox", function (id){
    	console.log("lightbox opened");
	});

	scheduler.attachEvent("onAfterLightbox", function (){
    	console.log("lightbox closed");
	});


	//-------CUSTOM LIGHTBOX CODE-----------
	//Overriding the default lightbox behavior
	var customLightbox = document.getElementById("custom_lightbox");
	scheduler.showLightbox = function(id){
		var doc = document;
		var evt = scheduler.getEvent(id);
		scheduler.startLightbox(id, customLightbox);

		//console.log("ID in showLightbox: " + id + ", Event.ID: " + evt.id);

		//HEADER AT THE TOP
		doc.getElementById("lightbox-title").innerHTML = evt.text;

		//START TIME
		$('#lightbox-start-time').timepicker('setTime', evt.start_date);
		//END TIME
		$('#lightbox-end-time').timepicker('setTime', evt.end_date);

		//DATE
		$('#lightbox-date').datepicker('update', evt.start_date);

		//SERVICES
		/*
		Get list of services for this appointment by querying Appointment_Service table
		Call an AJAX function in order to run this query.
		*/
		//removes the selectedService class so no services from
		//previously opened lightbox are highlighted
		$("#lightbox-service-list li").removeClass("selectedService");
		getListOfServices(id, function(servList){
			var apptServArr = servList.trim().split("|");

			//get all the li options in the dropdown list of services
			var serviceOptions = $("#lightbox-service-list").children("li");
			if(serviceOptions.length > 0){
				serviceOptions.each(function(){
					//console.log("Service option: " + $(this).html());
					for(var i = 0; i < apptServArr.length; i++){
						if($(this).html() === apptServArr[i]){
							$(this).addClass("selectedService");
						}
					}
				});
			}
			//else?
		});
		

		//---EMPLOYEE DROPDOWN---
		var empList = scheduler.serverList("Unit_ID");
		//NOTE: properties of each object in empList are "key" (unit_id) and "label" (name)
		//used Object.getOwnPropertyNames(empList[0]) to determine this

		//remove the option elements before adding them,
		//otherwise the option DOM elements will kept being added
		//everytime the lightbox is opened
		$("#lightbox-emp-list").empty();

		//Create the option elements for the Employee dropdwon
		var empDrowpDown = doc.getElementById("lightbox-emp-list");
		var currentUnitID = evt.Unit_ID;
		var numEmps = empList.length;
		for (var i = 0; i < numEmps; i++){
			var emp = new Option(empList[i].label, empList[i].key);

			//set the selected employee in the dropdown to the one
			//scheduled for the appointment
			//ex - if Doug is selected, have Doug be the default selected employee
			if(empList[i].key === currentUnitID){
				emp.defaultSelected = true;
				emp.selected = true;
			}
			empDrowpDown.options.add(emp);
		}

		//SERVICES
		//Will need to get the list of services from DB
		//Also need the services for this appointment
		//If service(s) are changed, need to insert into Appt_Services table as well as Appointment
		
		//NOTES
		doc.getElementById("lightbox-notes").value = evt.Notes;
	}

	/*
  	//Customize lightbox
  	scheduler.config.lightbox.sections = [
  		{name:"Title", height:50, map_to:"text", type:"textarea"},
  		//TO-DO: NEED TO MAP TIME TO START_TIME AND END_TIME
  		{name:"time", height:72, type:"time", map_to:"auto"},
  		{name:"Notes:", height: 60, map_to:"Notes", type:"textarea"},
  		{name:"Employee", height:40, map_to:"Unit_ID", type:"select", options:scheduler.serverList("Unit_ID")}
	]

	//can use a multi-select for the types of services
	//http://docs.dhtmlx.com/scheduler/multiselect.html#populatingcheckboxesfromtheserver

	//make the title section of the light box read-only
	scheduler.attachEvent("onLightBox", function(){
		var titleSection = scheduler.formSection("Title");
		titleSection.control.disabled = true;
	});
	*/
	//----------------------------------------



	//recommended to put all custom templates inside onTemplatesReady() event
	//http://docs.dhtmlx.com/scheduler/api__scheduler_ontemplatesready_event.html

	//Initialize scheduler
	scheduler.init('scheduler_here', new Date(), "unit");
	/*
	This allows for dynamic loading of data. Setting the load mode to "week"
	allows for data for a particular week to be loaded at once, instead of every single event.
	http://docs.dhtmlx.com/scheduler/loading_data.html#dynamicloading
	*/
	scheduler.setLoadMode("week");

	scheduler.load("lib\\load_events.php"); 

	/*
	Code below initializes a dataProcessor object, which allows data
	changes made by the user or programatically to be updated automatically.
	The constructor accepts the path to the same data source file as load()
	API: http://docs.dhtmlx.com/dataprocessor__index.html
	*/
	dp = new dataProcessor("lib\\load_events.php");
	dp.init(scheduler);

	//REMOVING AUTO-UPDATE
	//dp.setUpdateMode("off");

	dp.attachEvent("onAfterUpdate", function(id, action, tid, response){
		console.log("onAfterUpdate triggered. Action: " + action + " New ID: " + tid);
		//tid returns the id of the appointment in the appt table in the database (not the generated one)
		//if action != error or invalid, then send data

		//send tid to AJAX method
		//dp.send();
	});
	
	//dataProcessor is initialized in the auto-update mode by default, 
	//i.e. after each change in the grid, data is sent to the server.
	/*
	dp.attachEvent("onBeforeUpdate", function(id, state, data){
	    console.log("DP - BeforeUpdate, ID: " + id + ",  State: " + state + ",  Data: " + data);
	});
	*/
	
	//dp.setTransactionMode("POST");
	
	
	/*
	Can save data to XML using toXML() method:
	var output = scheduler.toXML();
	http://docs.dhtmlx.com/scheduler/export.html
	*/

	//Add events to calendar
	//Will eventually load data from a database:
	//http://docs.dhtmlx.com/scheduler/loading_data.html#loadingdatafromadatabase
	/*
	var events = [		
		{start_date:"05/14/2015 10:30", end_date:"05/14/2015 11:00", text:"Haircut -- Joe Smith", color:"#3A87AD", EmployeeID:"1"},
		{start_date:"05/14/2015 09:00", end_date:"05/14/2015 09:30", text:"Haircut -- Christian", color:"#3A87AD", EmployeeID:"1"},
		{start_date:"05/14/2015 12:00", end_date:"05/14/2015 12:30", text:"Shave -- Dylan", color: "#FF887C", EmployeeID:"1"},
	    {start_date:"05/14/2015 09:30", end_date:"05/14/2015 10:00", text:"Color -- Jane Doe", color:"#F58839", EmployeeID:"2"},
	    {start_date:"05/14/2015 12:30", end_date:"05/14/2015 12:45", text:"Eyebrow Wax -- Jane Doe", color: "#C353E8", EmployeeID:"2"},
	    {start_date:"05/14/2015 11:00", end_date:"05/14/2015 11:15", text:"Beard Trim -- Jonathan", color:"#368C23", EmployeeID:"2"},
	    {start_date:"05/14/2015 12:30", end_date:"05/14/2015 13:00", text:"Haircut -- Dylan", color:"#3A87AD", EmployeeID:"3"},
	    {start_date:"05/14/2015 09:30", end_date:"05/14/2015 10:00", text:"Color -- Jane Doe", color:"#F58839", EmployeeID:"5"}
	];

	//the parse() method loads data from an inline set (JSON)
	scheduler.parse(events,"json");
	*/





	/* If user selects "Unavailable" from service dropdown,
	show fields to enter start/end time employee is unavailable, or All-Day checkbox.
	Also disable the appointment start-time fields and customer name field to not confuse user. 
	Might be able to do this with Javascript, onchange()*/
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
	check box, then disable the start and end time fields 
	Might be able to do this with Javascript, onchange()*/
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

	//On the lightbox, if the user clicks/taps a service, 
	//toggle the selected class. This will allow the user to easily
	//make a selection for the service(s)
	$("#lightbox-service-list li").click(function(event){
		event.preventDefault();
		$(this).toggleClass("selectedService");
	});

	/*
	Need to attach the event listener to the document, or other parent element
	already generated. For exmaple, the cust-history-close link is generated
	by PHP, so an event listener cannot be attached to it when the document loads.
	JQuery only sets up the event listeners once. Also, the document element does not 
	change over the life of this DOM.

	The selector which is assigned the event ($document) is evaluated once when the page loads.
	The 2nd argument to .on() indicates to trigger the function if the originating element
	matches this filter. This is evaluated when the event is triggered.
	http://publicvoidlife.blogspot.com/2014/03/on-on-or-event-delegation-explained.html
	*/
	$(document).on('click', '#cust-history-close', function(){
		$(".customer-history").hide(300);
	});

	/* If user does not want to add new customer, close no-customer-returned window */
	$(document).on('click', '#no-cust-btn-no', function(){
		$("#no-customer-returned").hide(300);
	});

	/*If a user clicks on a row returned in the search results window,
	then select that row's radio button */
	$(document).on('click', '.cust-search-row', function(){
		$(this).find("input").prop("checked", true);
		$(".cust-search-row").removeClass("cust-search-selected");
		$(this).addClass("cust-search-selected");
	});

	//If a user double clicks on a row, then select that customer and close window
	$(document).on('dblclick', '.cust-search-row', function(){
		selectCustomer();
	});

});

/*
This function is triggered when the user clicks the Cancel button on the custom lightbox.
It will close the lightbox, and neither Save any data nor Delete the event.
*/
function close_form(){
	var customLightbox = document.getElementById("custom_lightbox");
	scheduler.endLightbox(false, customLightbox);
}

/*
This function is triggered when the user clicks the Delete button on the custom lightbox.
It will prompt the user with a confirm box asking if they want to delete the appointment.
Once deleted, the lightbox and quick info window are closed.
*/
function delete_event(){
	dhtmlx.confirm({
		text:"Are you sure you want to delete this appointment?",
		ok:"Yes",
		cancel:"No",
		callback:function(ret){
					if(ret){
						scheduler.hideQuickInfo();

						var customLightbox = document.getElementById("custom_lightbox");
						var event_id = scheduler.getState().lightbox_id;

						scheduler.deleteEvent(event_id);

						scheduler.endLightbox(false, customLightbox);

						//displays a message in the top right corner for a few seconds, then goes away
						//can make these nicer with styling: http://docs.dhtmlx.com/message__working_with_windows.html
						dhtmlx.message("Appointment Deleted!");
					}
				}
	});
}

/*
This function is triggered when the user clicks the Save button on the custom lightbox.
It will get the data the user enters and update the selected appointment.
*/
function save_form(){

	//hide the quick info popup so it is not displayed once the user makes their changes
	scheduler.hideQuickInfo();

	var doc = document;
	var customLightbox = doc.getElementById("custom_lightbox");
	//get the event object
	var appt = scheduler.getEvent(scheduler.getState().lightbox_id);
	var apptID = appt.id;

	var startTime = doc.getElementById("lightbox-start-time").value;
	var endTime = doc.getElementById("lightbox-end-time").value;
	var date = doc.getElementById("lightbox-date").value;
	var employee = doc.getElementById("lightbox-emp-list").value;
	var notes = doc.getElementById("lightbox-notes").value;

	//----TIME----
	//Input: HH:MM AM/PM
	//Output: HH:MM
	var frmtedStartTime = formatTime(startTime);
	var frmtedEndTime = formatTime(endTime);
	//If frmtedStartTime > frmtedEndTime, then show error

	//----DATE----
	//Format In: MM/DD/YYYY
	//Format Out: YYYY-MM-DD
	var frmtedDate = formatDate(date);
	var startString = frmtedDate + " " + frmtedStartTime;
	var endString = frmtedDate + " " + frmtedEndTime;
	var start = new Date(startString);
	var end = new Date(endString);

	//----EMPLOYEE NAME & APPT COLOR----
	//get color from JSON object
	var employeeList = doc.getElementById("lightbox-emp-list");
	var employeeName = employeeList.options[employeeList.selectedIndex].text;
	var apptColor = getApptColor(employeeName);

	
	//----SERVICES----
	/*
	Get the services selected by the user, then update the title
	of the appointment based on these new services.	If the services have changed,
	need to update Appointment_Service table.
	*/
	var selectedSrvcs = $("#lightbox-service-list").children(".selectedService");
	var numSelectedSrvcs = selectedSrvcs.length;
	var origTitle = appt.text;
	var origSrvs = origTitle.substring(0, origTitle.indexOf(" --- "));
	var rest = origTitle.substring(origSrvs.length);
	var newSrvcs = "";

	//Create string list of new services
	//This string will be part of new appt.text
	if(numSelectedSrvcs > 0){
		selectedSrvcs.each(function(index){
			if(index < (numSelectedSrvcs - 1)){
				newSrvcs += $(this).html() + ", ";
			}
			else{
				newSrvcs += $(this).html();
			}
			
		});
	}

	//Check if the user changed the services for the appt.
	//If so, need to update Appointment_Service table
	var oldSrvcsArr = origSrvs.split(", ").sort();
	var newSrvcsArr = newSrvcs.split(", ").sort();
	if(oldSrvcsArr.join() !== newSrvcsArr.join()){
		//service lists are different, so need to update Appointment_Service table

		//NOTE:only change appt.text once the update to Appointment_Service is complete and successful
		//can do this in callback function
		updateServices(apptID, newSrvcsArr);
	}	

	//TO-DO: check for event collision for new event

	//TO-DO: check if start-time is greater than end-time


	/*
	set all attributes of the event to the value of the HTML field objects
	NOTE: Here I am setting the EmployeeID to be the Unit_ID
	Technically, the Unit_ID and EmployeeID could be different
	Don't want to make a DB call just to get one ID
	*/
	appt.EmployeeID = employee;
	appt.Unit_ID = employee;
	appt.color = apptColor;
	appt.Notes = notes;
	appt.start_date = start;
	appt.end_date = end;
	appt.text = newSrvcs + rest;

	scheduler.updateEvent(apptID);
	dp.setUpdated(apptID, "updated");

	scheduler.endLightbox(false, customLightbox);

	//displays a message in the top right corner for a few seconds, then goes away
	dhtmlx.message({
		type: "customMsgBox",
		text: "Appointment Saved!"
	});
	
}
//-------------

/*
This function is triggered when the user clicks the Make Appointment button, and makes the appointment. 
It first performs validation of the entered data; verifying no required fields are blank,
the start time is not greater than end time, and also that the times are withing business hours.
Once fields are verified, it gets the color of the appointment block from a JSON object 
(color is based on the employee name), and then gets the required IDs from the database 
(Customer.ID, Employee.ID, and Employee.Unit_ID). It then  calls the addEvent() DHTMLX method to add the event, 
then clears the fields.
*/
function makeAppointment(){
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

	//------CHECK IF ANY REQUIRED FIELDS ARE BLANK------------
	//The formObjects array contains JS objects which need to be checked if they are blank,
	//if they are blank, they have a red border added to their text field.
	//Need to pass in the JS object in order to add this affect.
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
	//Once the fields are determined to be not blank, validate them
	if(fieldsLength){
		var valid = true;

		//remove any badField classes (red borders) from any fields
		$(".field_labels input").removeClass("badField");
		//is this needed? should this be done in verifyApptFields()?

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
		var apptTileCal = apptTitle;	//This will hold the string displayed in the event, listing the services
		var employeeName = employeeNameObj.value;
		var apptNotes = apptNotesObj.value;

		var startTime = "";
		var endTime = "";

		//--------SET THE START AND END-TIMES----------
		//If user selected Unavailable, get the values for the start/end-time
		//from the Unavailable fields. Also set the customerName to employeeName
		//so the employeeName is the value which shows on the event
		//Note apptTitle stores the value entered in the FIRST service dropdown
		if(apptTitle === 'Unavailable'){
			//Set value for customerName to be employeeName so the employee name
			//appears on the calendar for Unavailable, not the customer name
			customerName = employeeName;

			if(unavailableAllDay.checked){
				//TO-DO: Get the first and last hour of the scheduler, instead of hard-coding
				//scheduler.config.first_hour = 9;
				//scheduler.config.last_hour = 20;
				startTime = "09:00";
				endTime = "19:30";
				//console.log("first hr: " + scheduler.config.first_hour);
			}
			else {
				var unavlStrtTimeEntered = doc.getElementById("unavailable-start-time").value;
				var unavlEndTimeEntered = doc.getElementById("unavailable-end-time").value;
				//already verified the startTime and endTime for a non-all-day unavailable appt are not blank

				/*formatTime() returns time entered in military time:
				Input: HH:MM AM/PM
				Output: HH:MM */
				startTime = formatTime(unavlStrtTimeEntered);
				endTime = formatTime(unavlEndTimeEntered);

				//show error msg if startTime is greater than or equal to endTime
				if(startTime >= endTime){
					valid = false;
					$("#unavailable-time-error").show();
				}
				else{
					$("#unavailable-time-error").hide();		
				}
			}
		}
		//If user did NOT select "Unavailable", then get start time from time field,
		//and determine end time based on the hour(s) and minute(s) the user entered
		//using the up and down arrows next to the time field.
		//Also get the other services the user listed for the appointment (if any)
		else{
			/*formatTime() returns time entered in military time:
			Input: HH:MM AM/PM
			Output: HH:MM */
			startTime = formatTime(apptTime);
			var hoursNum = parseInt(apptTimeHours);
			var minsNum = parseInt(apptTimeMins);

			//Make sure both hours AND mins are NOT 0
			//one or the other can be 0, but not both
			if((hoursNum === 0) && (minsNum === 0)){
				valid = false;
				$("#appt-time-error").show();
			}
			else{
				$("#appt-time-error").hide();
				endTime = getEndTime(hoursNum, minsNum, startTime);
			}

			//----------GET ADDITIONAL SERVICES, IF ANY----------
			//if the service-dropdown-area has any new-service-dropdown children,
			//then get those values and append them to a string, with each
			//service delimited with "|"
			var services = apptTitle;
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
		}

		//-------CHECK IF START AND END TIME ARE WITHIN BUSINESS HOURS---------
		/*
		TO-DO: Check with Kieron/Tiara when they would make the last appt for
		if they close at a certain time. If they close at 7:30, is that when the last appt is
		made for? If so, then that would be the start-time of the last appt.
		TO-DO: Get/set start-time from either database, file, etc. not hardcoded.
		get the start time of the calendar from the scheduler settings
		*/
		if(startTime < "09:00"){
			valid = false;
			$("#make_appt_bad_hrs_msg").show();
		}
		else{
			$("#make_appt_bad_hrs_msg").hide();
		}

		if(valid){
			//------SET COLOR OF APPOINTMENT ON CALENDAR---------
			//Get the color from the employee JSON object in emp_info.js
			//could also use CSS: 
			//http://docs.dhtmlx.com/scheduler/custom_events_color.html#attachingadditionalcssclassestoanevent
			var apptColor = getApptColor(employeeName);

			//--------GET ID's FROM DATABASE-----------
			//call an AJAX function to get ID of customer
			//only get customerID if service is NOT Unavailable
			getApptIDs(customerName, employeeName, apptTitle, function(ret){
				//var data = JSON.parse(ret);
				var employeeUnitID = ret.EmpUnitID;
				var employeeID = ret.EmpID;
				var customerID = ret.CustID;

				addEventToCalendar(apptDateIn, startTime, endTime, apptTileCal, customerName, employeeUnitID, employeeID, customerID, apptNotes, apptColor, services);	

				//displays a message in the top right corner for a few seconds, then goes away
				//dhtmlx.message("Appointment Created!");
			});
		}
	}
	else{
		$("#make_appt_reqrd_fields_msg").show();
		//valid = false;
	}
}

/*
This function executes the scheduler.addEvent function, adding the event to the calendar
*/
function addEventToCalendar(apptDateIn, startTimeIn, endTimeIn, titleIn, customerNameIn, unitIDIn, employeeIDIn, customerIDIn, notesIn, colorIn, servicesIn){
	
	console.log("----Enter addEventToCalendar----");
	/*
	console.log("Date: " + apptDateIn);
	console.log("StartTime: " + startTimeIn);
	console.log("EndTime: " + endTimeIn);
	*/
	console.log("Title: " + titleIn);
	console.log("CustomerName: " + customerNameIn);
	/*
	console.log("UnitID: " + unitIDIn);
	console.log("EmployeeID: " + employeeIDIn);
	console.log("CustomerID: " + customerIDIn);
	console.log("Notes: " + notesIn);
	console.log("Color: " + colorIn);
	*/
	console.log("---------------------------------");
	

	//TO-DO: Check for event collision. Do not run addEvent if there will be a collision

	//NOTE the format of the value for event.text is important since that string is parsed
	//when generating the list of services to be inserted into the Appointment_Services table
	var event_id = scheduler.addEvent({
	    start_date:apptDateIn + " " + startTimeIn,
	    end_date:apptDateIn + " " + endTimeIn,
	    text:titleIn + " --- " + customerNameIn,
	    EmployeeID:employeeIDIn,
	    Unit_ID:unitIDIn,
	    CustomerID:customerIDIn,
	    Notes:notesIn,
	    color:colorIn
	});

	//dp.sendData();

	//console.log("event_id: " + event_id);

	//dp.setUpdated(event_id, "inserted");

	//var collision = scheduler.checkCollision(event_id);
	//console.log("Collision?: " + collision + " ID: " + event_id);

	//TO-DO: Verify the event was added successfully

	//Clear fields
	clearAppointmentFields();
}

/*
Verifies all fields in the entered array are not empty (length != 0).
If the field is empty, it's text input field has a red border added.
Returns true if all fields are not blank, false otherwise.
This is mainly used when verifying fields when making an appointment.
EDIT: Removed making the sibling label red font color if a field was empty.
This did not always work since the text fields do not always have sibling labels.
*/
function verifyAppointmentFieldsLength(formObjects){
	//console.log("Enter verifyAppointmentFields");

	var validFields = true;

	var numObjects = formObjects.length;
	for(var i = 0; i < numObjects; i++){
		//var siblingLabel = $(formObjects[i]).siblings("label").first();
		if(formObjects[i].value.length === 0){
			validFields = false;
			$(formObjects[i]).addClass("badField"); 
			//siblingLabel.addClass("emptyField"); 
		}
		else{
			$(formObjects[i]).removeClass("badField"); 
			//siblingLabel.removeClass("emptyField"); 
		}
	}

	return validFields;
}

/*
This function renders the event to the calendar based on the information passed in
*/
function renderCalendarAppt(apptDateIn, startTime, endTime, apptColor, apptTitle, apptNotes, customerName, unitID){
	/*
	Using the addEvent() method does trigger the onEventCollision event if there is a collision;
	however, need to figure out the flow of events. Don't want the parse() method to run
	if there is a collision.
	var event_id = scheduler.addEvent({
		start_date:apptDateIn + " " + startTime, end_date:apptDateIn + " " + endTime, color:apptColor, text:apptTitle + " -- " + customerName, unit_id:unitID
	});
*/
	/*
	var appt = [
		{start_date:apptDateIn + " " + startTime, end_date:apptDateIn + " " + endTime, color:apptColor, text:apptTitle + " -- " + customerName, EmployeeID:unitID}
	];

	scheduler.parse(appt, "json");
	*/
	
	//TO-DO: This is always returnng true
	//var collision = scheduler.checkCollision(event_id);
	//console.log("Collision?: " + collision + " ID: " + event_id);


}

/*
This function is called after an appointment is made to clear and/or 
reset the make appointment fields 
*/
function clearAppointmentFields(){
	//console.log("enter clearAppointmentFields");

	var doc = document;
	var custName = doc.getElementById("customer_name");
	var employee = doc.getElementById("employee-dropdown");
	var apptHours = doc.getElementById("appt-length-hours");
	var apptMins = doc.getElementById("appt-length-mins");
	var service = doc.getElementById("service-dropdown");
	var notes = doc.getElementById("notes_area");

	custName.value = "";
	employee.selectedIndex = 0;
	apptHours.value = "0";
	apptMins.value = "30";
	
	//hide unavailable fields if they are shown
	if(service.value === "Unavailable"){
		//make customerName enabled
		doc.getElementById("customer_name").disabled = false;

		//make start-time enabled
		doc.getElementById("start-time").disabled = false;

		//enable search button
		doc.getElementById("cust-search-button").disabled = false;

		if(doc.getElementById("unavailable-all-day").checked){
			doc.getElementById("unavailable-all-day").checked = false;
			doc.getElementById("unavailable-start-time").disabled = false;
			doc.getElementById("unavailable-end-time").disabled = false;
		}

		$("#unavailable-service").hide(300);
	}
	service.selectedIndex = 0;

	notes.value = "";

	//hide customer history table
	$(".customer-history").hide();

	//Reset Date picker to today's date
	//NOTE: took this out after linking the datepicker and calendar dates
	//var today = new Date();
	//$('#date').datepicker('update', today);

	//remove any additional service dropdowns the user may have added
	$(".new-service-dropdown").remove();

	//hide the plus sign next to the service dropdown
	//the plus sign is only displayed once the user makes an initial selection
	doc.getElementById("new-service-plus").style.display = "none";

	//hide any error messages that may have been produced
	$(".make_appt_bad").hide();
}

/*
This will check the value of the first service dropdown.
If the value is not the empty string, and not Unavailable, then
display the plus sign, allowing the user to add another service.
Else, hide the plus sign.
*/
function checkSelectedService(){
	var selectedService = document.getElementById("service-dropdown").value;
	var plusSign = document.getElementById("new-service-plus");

	/*only show the plus sign if selected service is not blank,
	and is not Unavailable. There is no need to add another service
	if selected service is Unavailable. */
	if( (selectedService !== "") && (selectedService !== "Unavailable") ){
		plusSign.style.display = "inline";
	}
	else{
		plusSign.style.display = "none";
	}
}

/*
This function adds a new dropdown listing the available services.
Native JS is used to create these DOM elements. Each DOM element added consists of
a div container, the dropdown, and the plus and minus signs, allowing the user
to add another service, or remove this one. This function is triggered when the user 
clicks the plus sign next to the Services dropdown. The option values from the initial 
dropdown are copied into the option values for each subsequent dropdown added. 
This prevents a SELECT query to have to be executed in order to populate the values for 
each new dropdown.
*/
function addNewServiceLine(){
	var doc = document;

	//div to which the new dropdown is to be added
	var area = doc.getElementById("service-dropdown-area");

	//div containing the new dropdown
	var newGroup = doc.createElement("div");

	/*In order to assign a unique ID attribute to each of the new inputs, 
	count how many Select children nodes the 
	service-dropdown-area has, and then add one to that number 
	TO-DO: not really doing anything with this id, so not sure if it is needed*/
	var newSelect = doc.createElement("select");
	var newSelectIDNum = $(area).children().length + 1;
	var newSelectID = (newSelectIDNum).toString();
	newSelect.id = "service-dropdown" + newSelectID;

	//get the value of the child option elements for service-dropdown,
	//then append them to the new dropdown
	//each() function iterates through all results from the selector
	$("#service-dropdown > option").each(function(){
		var optionVal = $(this).val();

		/*Exclude Unavailable for the list of options for 
		additional services. Unavailable would never be needed as an
		additional service. */
		if(optionVal != "Unavailable"){
			var option = doc.createElement("option");
			option.text = optionVal;
			option.value = optionVal;

			newSelect.appendChild(option);
		}

	});
	
	$(newSelect).addClass("form-control");
	$(newSelect).addClass("field-dropdowns");

	//create link object with plus sign
	var plusSignLink = doc.createElement("a");
	plusSignLink.href = "#";
	plusSignLink.onclick = function(){addNewServiceLine()};
	var plusSign = doc.createElement("span");
	plusSign.style.fontSize = "2.5em";
	plusSign.style.top = "12px";
	plusSign.style.paddingLeft = "15px";
	$(plusSign).addClass("glyphicon");
	$(plusSign).addClass("glyphicon-plus-sign");
	plusSignLink.appendChild(plusSign);

	//create link object with minus sign
	var minusSignLink = doc.createElement("a");
	minusSignLink.href = "#";
	minusSignLink.onclick = function(){
		$(this).closest(".new-service-dropdown").remove();
	};
	var minusSign = doc.createElement("span");
	minusSign.style.fontSize = "2.5em";
	minusSign.style.top = "12px";
	minusSign.style.paddingLeft = "15px";
	$(minusSign).addClass("glyphicon");
	$(minusSign).addClass("glyphicon-minus-sign");
	minusSignLink.appendChild(minusSign);	


	newGroup.appendChild(newSelect);
	newGroup.appendChild(plusSignLink);
	newGroup.appendChild(minusSignLink);
	$(newGroup).addClass("form-group");
	$(newGroup).addClass("input-group-lg");
	$(newGroup).addClass("form-inline");
	$(newGroup).addClass("new-service-dropdown");

	area.appendChild(newGroup);
}


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
	//Get number of lines/children added
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

	$("#no_cust_selected_msg").hide();
}

/*
This function will take the name of the customer selected via radio button on the 
customer search results screen, and populate it in the Customer Name
field on the main screen
*/
function selectCustomer(){
	//if the user has chosen a customer, get the value
	var customerNameSelected = $("#cust_search_results_table input:checked").val();
	if(customerNameSelected){
		//Close search results window (closeCustSearchResults())
		closeCustSearchResults();

		//Populate customer name field with selected name
		document.getElementById("customer_name").value = customerNameSelected;

		document.getElementById("customer_search_results").value = customerNameSelected;
	}
	else{
		//if no radio button is selected, display message
		$("#no_cust_selected_msg").show(300);
	}
}
/*
TO-DO: Fix the methods used to add/subtract hours and minutes for the appointment.
The user should be able to set intervals for the minutes, and the default minutes displayed.
This can be set in text field in the Settings section, or in a JSON object
When the button is clicked, the interval value set is read, then added/subtract to/from the value
*/
/*
Increases minutes for the appointment by an interval of 15 mins
*/
function addApptMinutes(){
	var minsField = document.getElementById("appt-length-mins");
	//var minsInterval = document.getElementById("appt-min-interval");
	//Might be able to set this value in the settings page using JSON

	var minutes = minsField.value;
	//var interval = minsInterval.value;
	var minutesNum = parseInt(minutes, 10);
	//var intervalNum = parseInt(interval, 10);

	//var limit = 60 - intervalNum;
	minutesNum += 15;

	if(minutesNum >= 60){
		minutesNum = 0;
	}
	minsField.value = minutesNum;

	//the return value determines if the browser's default behavior should occur
	return false;
}

/*
Decreases minutes for the appointment by an interval of 15 mins
*/
function subtractApptMinutes(){
	var minsField = document.getElementById("appt-length-mins");
	var minutes = minsField.value;
	var minutesNum = parseInt(minutes, 10);
	minutesNum -= 15;
	if(minutesNum < 0){
		minutesNum = 45;
	}
	minsField.value = minutesNum;

	//the return value determines if the browser's default behavior should occur
	return false;
}

/*
Increases hours for the appointment by one
*/
function addApptHour(){
	var hourField = document.getElementById("appt-length-hours");
	var hours = hourField.value;
	var hoursNum = parseInt(hours, 10);
	hoursNum += 1;
	if(hoursNum > 8){
		hoursNum = 0;
	}

	hourField.value = hoursNum;

	return false;
}

/*
Decreases hours for the appointment by one
*/
function subtractApptHour(){
	var hourField = document.getElementById("appt-length-hours");
	var hours = hourField.value;
	var hoursNum = parseInt(hours, 10);
	hoursNum -= 1;
	if(hoursNum < 0){
		hoursNum = 8;
	}

	hourField.value = hoursNum;

	return false;
}

/*
This will format the appointment time into the form accepted by the calendar
Input: HH:MM AM/PM
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
	//console.log("returned val from formatTime: " + ret);
	return ret;
}

/*
Returns the date in the format accepted by MySQL DATE type (YYYY-MM-DD)
Format In: MM/DD/YYYY
Format Out: YYYY-MM-DD
*/
function formatDate(dateIn){
	var firstSlashIndex = dateIn.indexOf("/");
	var secondSlashIndex = dateIn.indexOf("/", (firstSlashIndex + 1));

	var month = dateIn.substring(0, 2);
	var day = dateIn.substring((firstSlashIndex + 1), (firstSlashIndex + 3));
	var year = dateIn.substring((secondSlashIndex + 1), (secondSlashIndex + 5));

	var ret = year + "-" + month + "-" + day;
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
New function to compute the end military time of the appointment,
given the hours and minutes, representing the length of the appointment.
Input: (1, 30, 10:30)
Return 12:00
*/
function getEndTime(hoursToAdd, minutesToAdd, startTime){
	var h = startTime.indexOf(':');
	var hourNum = parseInt(startTime.substring(0, h), 10);
	var minutesNum = parseInt(startTime.substr(h + 1), 10);

	var hours = '';
	var mins = '';

	var newHour = hourNum + hoursToAdd;
	var newMinutes = minutesNum + minutesToAdd;

	if(newMinutes >= 60){
		var dif = newMinutes - 60;
		newMinutes = dif;
		newHour += 1;
	}

	hours = newHour.toString();
	mins = newMinutes.toString();

	//if hours or minutes is 1 digit, need to prepend 0
	//This prevents time such as 10:0 and 9:0
	if(mins === "0") {
		mins = "0" + mins;
	}
	if(hours.length === 1) {
		hours = "0" + hours;
	}

	return hours + ":" + mins;
}

/*
This function will return a new military time with length added to it
*/
function addMilitaryTime(length, startTime) {
	/*
	TO-DO:
	-Time to add modulus 60 will return # of minutes to add
	-Integer division of time to add and 60 will return # of hours to add.
	Ex: Add 135 mins to 10:00 (1 hour and 15 mins)
	135 % 60 = 15 = mins
	Math.floor(135 / 60) = 2 = hours
	Add 2 to hours and 15 to minutes
	Note to change if overflow (10:45 plus 30 mins is 11:30)
	*/
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
	if(mins === "0") {
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
Revised version of getApptColor which gets the color of the employee
from a JSON object based on the employee name. There is a default color returned 
if no employee names match.
*/
function getApptColor(empName){
	var apptColor = "#F45245";
	var numEmp = employees.length;
	for(var i = 0; i < numEmp; i++){
		if(employees[i].name === empName){
			apptColor = employees[i].color;
		}
	}
	return apptColor;
}

/*
Returns the color of the event to appear on the calendar, based on
the title of the appointment (Haircut, Shave, etc.)
*/
function getApptColor_orig(apptTitle) {
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