$(document).ready(function(){

	/* When search button is clicked, move other fields down and
	show a list of the customers recent appointments and contact info */
	$('.cust-search-button').click(function() {
		var customerName = document.getElementById("cust_name_field").value;
		document.getElementById("customer-history-label").innerHTML = customerName;
		$(".customer-history").show(300);
	});

	$('#cust-history-close').click(function(){
		$(".customer-history").hide(300);
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