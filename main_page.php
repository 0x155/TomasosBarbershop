<html>
	<head>
		<meta charset="UTF-8">
		<!--Setting the viewport below allows the width of the page to be set to the
		width of the device (whether that be a desktop, tablet, or phone)
		https://developers.google.com/speed/docs/insights/ConfigureViewport
		user-scalable=no disables zoom on double-tap. If the user tapped a button twice,
		similar to a double tap, then it would zoom in. This is now disabled-->
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<title>Tomaso's Barbershop</title>

		<link rel="stylesheet" type="text/css" href="stylesheets\css\main.css"/>
		<link rel="stylesheet" type="text/css" href="lib\bootstrap\css\bootstrap.min.css"/>

		<!-- bootstrap version is 3.2 -->
		<!-- JQuery version is 2.1 -->
		<script type="text/javascript" src="jquery\jquery-2.1.1.js"></script>
		<script type="text/javascript" src="lib\bootstrap\js\bootstrap.js"></script>

		<!-- dhtmlx Scheduler -->
		<!-- Combine these scheduler files into one, and include that -->
		<script type="text/javascript" src="lib\dhtmlxScheduler_v4.2.0\codebase\dhtmlxscheduler.js"></script>
		<script type="text/javascript" src="lib\dhtmlxScheduler_v4.2.0\codebase\ext\dhtmlxscheduler_units.js"></script>
		<script type="text/javascript" src="lib\dhtmlxScheduler_v4.2.0\codebase\ext\dhtmlxscheduler_collision.js"></script>
		<script type="text/javascript" src="lib\dhtmlxScheduler_v4.2.0\codebase\ext\dhtmlxscheduler_quick_info.js"></script>
		<!--<script type="text/javascript" src="lib\dhtmlxConnector_php\codebase\connector.js"></script>-->
		<link rel="stylesheet" href="lib\dhtmlxScheduler_v4.2.0\codebase\dhtmlxscheduler.css" type="text/css" />
		<!--<link rel="stylesheet" href="stylesheets\stylesheet_dhtmlx.css" type="text/css" />-->

		<!-- Bootstrap datepicker -->
		<!-- http://bootstrap-datepicker.readthedocs.org/en/release/ -->
		<script type="text/javascript" src="lib\bootstrap\datepicker\js\bootstrap-datepicker.js"></script>
		<link rel="stylesheet" type="text/css" href="lib\bootstrap\datepicker\css\datepicker.css"/>

		<!-- Bootstrap timepicker -->
		<!-- https://github.com/jdewit/bootstrap-timepicker -->
		<!-- http://jdewit.github.io/bootstrap-timepicker/ -->
		<link rel="stylesheet" type="text/css" href="lib\bootstrap-timepicker\css\bootstrap-timepicker.min.css" />
		<script type="text/javascript" src="lib\bootstrap-timepicker\js\bootstrap-timepicker.min.js"></script>

		<!-- Handlebars runtime version 4.0.5 -->
		<script type="text/javascript" src="lib\handlebars\handlebars.runtime-v4.0.5.js"></script>
		<!-- Compiled handlebar templates. Command for this is:
		$ handlebars templates/ > templates/compiledTemplates.js -->
		<script type="text/javascript" src="templates\compiledTemplates.js"></script>

		<!-- Javascript/JQuery written by CB -->
		<script type="text/javascript" src="lib\application_dhtmlx.js"></script>
		<script type="text/javascript" src="lib\ajax_functions.js"></script>
		<script type="text/javascript" src="lib\emp_info.js"></script>
	</head>

	<body>
		<?php
		if(isset($_COOKIE['logged_in']) && $_COOKIE['logged_in'] == "true") {
		?>
		<div class="grid">
			<!-- http://getbootstrap.com/css/#grid-options -->
			<div class="row">
				<!--changed order here so calendar would be on top when viewed on mobile
				http://www.schmalz.io/2014/10/08/Column-Ordering-in-Bootstrap/-->
				<div class="col-md-8 col-md-push-4" id="calender-column">
					<div id="top_nav_user_info" class="group">
						<p id="user-greeting">Logged in as: <?php echo $_COOKIE['username']?></p>
						<button id="log-out-link" class="dhx_cal_today_button btn-default" onclick="logOut()">Log Out</button>
						<button type="button" class="btn btn-default btn-lrg"
										title="Settings"
										id="settings-button"
										onclick="showSettings()">
							<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
						</button>
						<div id="log-out-results"></div>
					</div>
					<!-- dhtmlx Scheduler verion 4.2-->
					<!-- This is the main calendar used  to schedule appointments -->
					<!-- http://docs.dhtmlx.com/scheduler/ -->
					<div id="scheduler_here" class="dhx_cal_container">
					    <div class="dhx_cal_navline">
					        <div class="dhx_cal_prev_button">&nbsp;</div>
					        <div class="dhx_cal_next_button">&nbsp;</div>
					        <div>
						        <button type="input" class="btn btn-default btn-lg" id="go-to-date-picker">
						        	<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
						        </button>
					        </div>
					        <div class="dhx_cal_today_button"></div>
					        <div class="dhx_cal_date"></div>
					    </div>
					    <div class="dhx_cal_header"></div>
					    <div class="dhx_cal_data"></div>
					</div>
				</div>

				<div class="col-md-4 col-md-pull-8 fields" id="field-column">
					<!-- action attribute tells the web browser where to send the data when form is submitted. Can be an absolute or relative URL-->
					<!-- method attribute tells browser how to send the data (GET/POST) -->
					<ul class="field_labels">
						<li id="customer-search-component"></li>
						<div id="customer_history"></div>
						<li class="form-group input-group-lg">
							<label for="date"><h4>Date:</h4></label>
							<input type="text" name="date" class="date_field form-control appt-date-picker" id="date" readonly>
							<!-- http://eternicode.github.io/bootstrap-datepicker/?#sandbox -->
						</li>
						<li class="form-group">
							<div id="time-fields" class="group">
								<div class="appt-column input-group-lg" id="start-time-col">
									<label for="start-time"><h4>Time:</h4></label>
									<input type="text" class="appt-timepicker form-control" id="start-time" readonly>
								</div>
								<div class="appt-column input-group-lg hours-min-col" id="hours">
									<button class="btn btn-default appt-time-arrow-btn time-up-arrows" id="hour-up-arrow" onclick="return addApptHour()"><span class="glyphicon glyphicon-chevron-up appt-time-arrow-span"></span></button>
									<input type="text" class="form-control" id="appt-length-hours" value="0" disabled>
									<p class="time_label">H</p>
									<button class="btn btn-default appt-time-arrow-btn time-down-arrows" id="hour-down-arrow" onclick="return subtractApptHour()"><span class="glyphicon glyphicon-chevron-down appt-time-arrow-span"></span></button>
								</div>
								<div class="appt-column input-group-lg hours-min-col" id="mins">
									<button class="btn btn-default appt-time-arrow-btn time-up-arrows" id="min-up-arrow" onclick="return addApptMinutes()"><span class="glyphicon glyphicon-chevron-up appt-time-arrow-span"></span></button>
									<input type="text" class="form-control" id="appt-length-mins" value="30" disabled>
									<p class="time_label">M</p>
									<button class="btn btn-default appt-time-arrow-btn time-down-arrows" id="min-down-arrow" onclick="return subtractApptMinutes()"><span class="glyphicon glyphicon-chevron-down appt-time-arrow-span"></span></button>
								</div>
							</div>
							<!--Displayed if hours and mins both equal 0 -->
							<p id="appt-time-error" class="error_msg">Note: Invalid time entered</p>
						</li>

						<li>
							<label for="service-dropdown"><h4>Service:</h4></label>
							<div id="service-dropdown-area">
								<div class="one-service-dropdown form-group input-group-lg form-inline">
									<select name="service" id="service-dropdown" class="form-control field-dropdowns" onchange="checkSelectedService()">
										<option value=""></option>
										<?php
											require_once("Service.php");
											Service::getServices("option");
										?>
									</select>
									<!-- user can click plus sign to add another type of service-->
									<a href="#" id="new-service-plus" onclick="addNewServiceLine()">
										<span class="glyphicon glyphicon-plus-sign" style="font-size:2.5em;top:12px;"></span>
									</a>
								</div>
							</div>
						</li>

						<li class="form-group input-group-lg">
							<label for="employee-dropdown"><h4>Employee:</h4></label>
							<select name="employee" id="employee-dropdown" class="form-control field-dropdowns">
								<option value=""></option>
								<?php
									//Employees are returned from DB in order of unit id
									require_once("Employee.php");
									Employee::getEmployeeNames();
								?>
							</select>
						</li>

						<!-- Only display this when the user selects "Unavailable" from Type of Service -->
						<!-- This will allow them to choose the start/end time the employee is unavailable,
						or be able to select that the employee is unavailable for the whole day -->
						<li id="unavailable-service">
							<label><input type="checkbox" id="unavailable-all-day">All Day</label>

							<div class="controls form-inline" id="unavailable-start-fields">
								<label class="control-label" for="unavailable-start-time">Start Time:</label>
								<input type="text" class="appt-timepicker" id="unavailable-start-time" readonly>
							</div>

							<div class="controls form-inline" id="unavailable-end-fields">
								<label class="control-label" for="unavailable-end-time">End Time:</label>
								<input type="text" class="appt-timepicker" id="unavailable-end-time" readonly>
							</div>

							<p id="unavailable-time-error" class="error_msg">Note: The entered start time is greater than or equal to end time</p>
						</li>

						<li class="form-group" id="notes-fields">
							<!-- The for attribute of the label tag matches the id of what it is labelling -->
							<!-- name attribute is the name of the data field -->
							<label for="notes_area"><h4>Notes:</h4></label>
							<textarea name="notes" id="notes_area" class="form-control" rows="5" cols="10"></textarea>
						</li>

						<li>
							<!-- The Make Appointment button will be used to submit info-->
							<!--<input type="submit" class="btn_default_cb make_appt_btn" value="Make Appointment">-->
							<button class="btn_default_cb make_appt_btn" onclick="makeAppointment()">Make Appointment</button>
						</li>

						<li id="make_appt_results"></li>

						<li>
							<!--Displayed if any fields are missing/empty-->
							<h4 id="make_appt_reqrd_fields_msg" class="error_msg">Please enter all required fields</h4>
							<h4 id="make_appt_bad_hrs_msg" class="error_msg">Note: The time entered is beyond business hours</h4>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div id="settings-modal-container"></div>
		<div id="new-customer-modal-container"></div>

		<!--Custom Lightbox-->
		<div id="custom_lightbox">
			<div id="lightbox-header">
				<h4 id="lightbox-title"></h4>
			</div>
			<div>
				<table id="lightbox-table">
					<tr>
						<td>Start-Time:</td>
						<td id="time-row">
							<!--Put the start-time field, end-time label, and end-time field in the same column for formatting purposes -->
							<input type="text" id="lightbox-start-time" class="appt-timepicker form-control" readonly>
							End-Time:
							<input type="text" id="lightbox-end-time" class="appt-timepicker form-control" readonly>
						</td>
					</tr>
					<tr>
						<td>Date:</td>
						<td><input type="text" class="appt-date-picker form-control" id="lightbox-date" readonly></td>
					</tr>
					<tr>
						<td>Services:</td>
						<td>
							<!--TO-DO: add light grey top and bottom border around this -->
							<ul id="lightbox-service-list">
								<?php
									require_once("Service.php");
									Service::getServices("li");
								?>
							</ul>
						</td>
					</tr>
					<tr>
						<td>Employee:</td>
						<td><select id="lightbox-emp-list" class="form-control"></select></td>
					</tr>
					<tr>
						<td>Notes:</td>
						<td><textarea id="lightbox-notes" class="form-control" rows="3"></textarea></td>
					</tr>
				</table>
				<div id="lightbox-buttons">
					<button class="btn_default_cb" id="lightbox-save-btn" onclick="save_form()">Save
						<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
					</button>
					<button class="btn_default_cb" id="lightbox-cancel-btn" onclick="close_form()">Cancel</button>
					<button class="btn_default_cb" id="lightbox-delete-btn" onclick="delete_event()">Delete
						<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
					</button>
				</div>

				<div>
					<p id="lightbox-conflict-error" class="lightbox_error_msgs error_msg">There is already an appointment scheduled for that time</p>
					<p id="lightbox-services-error" class="lightbox_error_msgs error_msg">Note: You did not enter any services</p>
					<p id="lightbox-time-error" class="lightbox_error_msgs error_msg">Note: Entered start time is greater than end time</p>
					<p id="lightbox-time-past-error" class="lightbox_error_msgs error_msg">Note: Entered start time is beyond business hours</p>
					<p id="lightbox-services-unavailable" class="lightbox_error_msgs error_msg">Sorry, the services are currently unavailable</p>
				</div>

			</div>
		</div>

		<?php
		}
		else{
		?>
			<script>window.location.href = "index.html";</script>
		<?php
		}
		?>

		<script src="bundle.js"></script>
	</body>

</html>
