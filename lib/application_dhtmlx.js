$(document).ready(function(){

	//JavaScript to set up the DHTMLX Scheduler
	//scheduler.locale.labels.unit_tab = "Unit";
	scheduler.createUnitsView({
	    name:"unit",
	    property:"EmployeeID", //the name of a data property that will be used to assign events to certain units

	    //True so events not assigned to a unit will not be displayed.
	    //Otherwise, incorrect events would go to the first unit
	    skip_incorrect: true, 
	    
	    
	    list:[              
	        {key:1, label:"Kieron"},
	        {key:2, label:"Tiara"},
	        {key:3, label:"Doug"},
	        {key:4, label:"Melvin"},
	        {key:5, label:"Jackie"}
	    ]
	    
	    //using the serverList method retrieves the list of employeeIDs,
	    //representing the unit_id for the calendar
	    //list:scheduler.serverList("EmployeeID")
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
	//scheduler.config.xml_date = "%Y-%m-%d %H:%i:%s";

	//Brings up the light box when you double click on an event in the calendar
	//This displays fields about the event, which can be customized
	scheduler.config.details_on_dblclick=true;

	//shows a spinning logo while the data loads
	scheduler.config.show_loading = true;

	//Does not allow user to drag or move events on calendar
	//may change later
	scheduler.config.drag_move = false;

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

	scheduler.attachEvent("onEventCollision", function (ev, evs){
		console.log("Scheduler - Event collision");
	});

  	scheduler.attachEvent("onEventAdded", function(id,ev){
	    console.log("Scheduler - Event added. New event ID: " + id);
	});

	scheduler.attachEvent("onEventChanged", function(id,ev){
	    console.log("Scheduler - Event changed. ID: " + id + "  Evt: " + ev);
	});

  	
  	scheduler.config.lightbox.sections = [
  		{name:"Title", height:50, map_to:"text", type:"textarea"},
  		{name:"time", height:72, type:"time", map_to:"auto"},
  		{name:"Notes:", height: 60, map_to:"notes", type:"textarea"},
  		{name:"Employee", height:40, map_to:"EmployeeID", type:"select", options:scheduler.serverList("EmployeeID")}
	]
	

	//recommended to put all custom templates inside onTemplatesReady() event
	//http://docs.dhtmlx.com/scheduler/api__scheduler_ontemplatesready_event.html

	//Initialize scheduler
	scheduler.init('scheduler_here', new Date(), "unit");
	/*
	This allows for dynamic loading of data. Setting the load mode to "month"
	allows for monthly data to be loaded at once, instead of severy single event.
	http://docs.dhtmlx.com/scheduler/loading_data.html#dynamicloading
	scheduler.setLoadMode("week");
	*/
	//scheduler.load("lib\\load_events.php"); //loads data from a file (XML) or database,
	//specify path to server-side script

	/*
	Code below initializes a dataProcessor object, which allows data
	changes made by the user or programatically to be updated automatically.
	The constructor accepts the path to the same data source file as load()
	API: http://docs.dhtmlx.com/dataprocessor__index.html
	
	var dp = new dataProcessor("lib\\update_events.php");
	dp.init(scheduler);
	//dataProcessor is initialized in the auto-update mode by default, 
	//i.e. after each change in the grid, data is sent to the server.

	dp.attachEvent("onBeforeUpdate", function(id, state, data){
	    console.log("DP - BeforeUpdate, ID: " + id + ",  State: " + state + ",  Data: " + data);
	});

	dp.attachEvent("onBeforeDataSending", function(id, state, data){
		console.log("DP - onBeforeDataSending, ID: " + id);
	});

	dp.setTransactionMode("POST");
	*/
	/*
	Can save data to XML using toXML() method:
	var output = scheduler.toXML();
	http://docs.dhtmlx.com/scheduler/export.html
	*/

	//Add events to calendar
	//Will eventually load data from a database:
	//http://docs.dhtmlx.com/scheduler/loading_data.html#loadingdatafromadatabase
	
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
	
/*
	$("#add_evt_button").click(function(){
		scheduler.addEvent({
			//NOTE: Date must be in DD-MM-YYYY
		    start_date: "13-05-2015 11:00",
		    end_date:   "13-05-2015 12:00",
		    text:   "Test haircut",
		    EmployeeID: 1,
		    CustomerID: 20,
		    notes: "test haircut with Jonathan"
		});

		//var collision = scheduler.checkCollision(event_id);
		//console.log("Collision?: " + collision + " ID: " + event_id);
	});
*/
	/* When search button is clicked, move other fields down and
	show information based on search results. 
	1.) If search returns a match, display customer history and information
	2.) If partial match, return top results and ask user which to choose
	3.) If no matches, ask user if they want to add new customer */
	$('#cust-search-button').click(function() {




		//dp.sendData();

		//var evts = scheduler.getEvents();
		//console.log("Num events: " + evts.length);

		//var customerName = document.getElementById("customer_name").value;
		//console.log("enter cust-search-button click function: " + customerName);
		/*For demo purposes, if the customerName entered is Christian,
		then bring up customer history screen with my name */
		/*
		if(customerName === "Christian"){
			console.log("name condition met, showing customer-history");
			$(".customer-history").show(300);
			//document.getElementById("customer-history-label").innerHTML = customerName;
		}
		*/
		/* Else, if anything else is entered, then display 
		modal_wrapper_cust_search_results window.*/
		/*
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
		*/
	});

	//Sets up the DatePicker for the appointment
	//The new customer birthday field wil also use DatePicker, but will be
	//configured differently
	$('#date').datepicker({
		todayBtn:"linked",
		autoclose:true,
		todayHighlight:true,
		/*note the below option works in IE but not Chrome
		This may be because the date id is a text field
		The go-to-date field disables the keyboard but it is an icon, not text input.
		Making the date field readonly disables the keyboard, but user wont be able to
		manually enter date. TO-DO: Check w/ Kieron if this is okay*/
		disableTouchKeyboard:true,
		keyboardNavigation:false,
		daysOfWeekDisabled:'0'
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
	
	var appt = [
		{start_date:apptDateIn + " " + startTime, end_date:apptDateIn + " " + endTime, color:apptColor, text:apptTitle + " -- " + customerName, EmployeeID:unitID}
	];

	scheduler.parse(appt, "json");
	

	/*
	var event_id = scheduler.addEvent({
		start_date:apptDateIn + " " + startTime, 
		end_date:apptDateIn + " " + endTime,
		text:apptTitle + " -- " + customerName,
		color: apptColor,
		EmployeeID:unitID,
		notes:apptNotes
	});
	*/

	//TO-DO: This is always returnng true
	//var collision = scheduler.checkCollision(event_id);
	//console.log("Collision?: " + collision + " ID: " + event_id);

	//displays a message in the top right corner for a few seconds, then goes away
	//dhtmlx.message("Appointment Scheduled!");
}

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
	var today = new Date();
	$('#date').datepicker('update', today);

	//remove any additional service dropdowns the user may have added
	$(".new-service-dropdown").remove();

	//hide the plus sign next to the service dropdown
	//the plus sign is only displayed once the user makes an initial selection
	doc.getElementById("new-service-plus").style.display = "none";
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
This function will return the end time of an appointment based on type of service
Haircut = 30 mins
Beard Trim = 15 mins
Shave = 30 mins
Color = 30 mins
Eyebrow Wax = 15 mins

startTime needs to be in Military time (i.e 09:00, 14:30) 
*/
function getEndTime_Orig(service, startTime){
	//TO-DO: Remove this logic since user is setting length of appointment
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