$(document).ready(function(){

	/* When search button is clicked, move other fields down and
	show information based on search results. 
	1.) If search returns a match, display customer history and information
	2.) If partial match, return top results and ask user which to choose
	3.) If no matches, ask user if they want to add new customer */
	$('.cust-search-button').click(function() {
		var customerName = document.getElementById("customer_name").value;
		document.getElementById("customer-history-label").innerHTML = customerName;
		//$(".customer-history").show(300);
		$("#no-customer-returned").show(300);
	});

	/* This closes the window showing customer history and informaton */
	$('#cust-history-close').click(function(){
		$(".customer-history").hide(300);
	});

	$('#no-cust-btn-yes').click(function(){
		
	});

	/* If user does not want to add new customer, close no-customer-returned window */
	$('#no-cust-btn-no').click(function(){
		$("#no-customer-returned").hide(300);
	});

	//Sets up the datepicker
	$('.datepicker').datepicker({
		todayBtn:"linked",
		autoclose:true,
		todayHighlight:true,
		daysOfWeekDisabled:'0'
	});

	//Pre-fill Date with today's date
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1; //Jan = 0
	var year = today.getFullYear();
	$('.datepicker').datepicker('update', month+"/"+day+"/"+year);


	//Time Picker
	$('#appt-timepicker').timepicker();

	//Sets up Calendar
	$('.calendar').fullCalendar({
		defaultView:'agendaDay',
		contentHeight:715,
		slotDuration:'00:15:00',
		minTime:"09:00:00",
		maxTime:"19:30:00",
		allDayText: "",

		/*arranges buttons on top*/
		/*CSVs appear adjacent,
		items seperated by space appear with a gap */
		header: {
			left:'prev',
			center: 'title',
			right:'today next'
		}
	});

	//JQuery DOM manipulation to have the full-calendar show columns for each employee
	$(".fc-day-grid .fc-bg .fc-day").after("<td class=\"employee_col\">Jackie</td>");
	$(".fc-day-grid .fc-bg .fc-day").after("<td class=\"employee_col\">Melvin</td>");
	$(".fc-day-grid .fc-bg .fc-day").after("<td class=\"employee_col\">Doug</td>");
	$(".fc-day-grid .fc-bg .fc-day").after("<td class=\"employee_col\">Tiara</td>");
	$(".fc-day-grid .fc-bg .fc-day").after("<td class=\"employee_col\">Kieron</td>");

	$(".fc-time-grid .fc-bg .fc-day").after("<td class=\"fc-widget-content\"></td>");
	$(".fc-time-grid .fc-bg .fc-day").after("<td class=\"fc-widget-content\"></td>");
	$(".fc-time-grid .fc-bg .fc-day").after("<td class=\"fc-widget-content\"></td>");
	$(".fc-time-grid .fc-bg .fc-day").after("<td class=\"fc-widget-content\"></td>");
	$(".fc-time-grid .fc-bg .fc-day").after("<td class=\"fc-widget-content\"></td>");

	$(".fc-day-grid .fc-bg .fc-day").remove();
	$(".fc-time-grid .fc-bg .fc-day").remove();
	

});