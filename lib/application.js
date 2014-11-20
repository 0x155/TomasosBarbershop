$(document).ready(function(){

	$('.cust-search-button').click(function() {
		//append a text box with customer info?
		$('.not-customer-name').toggleClass('move-down');
	});

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
	

	$('.calendar2').fullCalendar({
		defaultView:'agendaDay',
		contentHeight:700,
		slotDuration:'00:15:00',
		minTime:"09:00:00",
		maxTime:"19:30:00",

		/*arranges buttons on top*/
		/*CSVs appear adjacent,
		items seperated by space appear with a gap */
		header: {
			left:'',
			center: '',
			right:''
		}
	});

});