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

		<link rel="stylesheet" type="text/css" href="stylesheets\shop_stylesheet.css"/>
		<link rel="stylesheet" type="text/css" href="stylesheets\media_queries.css">
		<link rel="stylesheet" type="text/css" href="lib\bootstrap\css\bootstrap.min.css"/>

		<!-- bootstrap version is 3.2 -->
		<!-- JQuery version is 2.1 -->
		<script type="text/javascript" src="jquery\jquery-2.1.1.js"></script>
		<script type="text/javascript" src="lib\bootstrap\js\bootstrap.js"></script>

		<!-- dhtmlx Scheduler -->
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
					<div id="top_nav_user_info">
						<p id="user-greeting">Logged in as: <?php echo $_COOKIE['username']?></p>
						<button id="log-out-link" class="dhx_cal_today_button" onclick="logOut()">Log Out</button>
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
						<li id="customer-info-top-fields">
							<label id="cust_name_label" for="customer_name"><h4>Customer Name:</h4></label>
							<div class="input-group input-group-lg" id="cust-name-fields">
								<input type="text" name="customer_name" placeholder="Customer Name" class="form-control" id="customer_name" autofocus>
								<span class="input-group-btn">
									<button type="button" class="btn btn-default" name="cust-search-button" id="cust-search-button" onclick="customerSearch()">Search</button>
								</span>
							</div>
							<div id="customer_search_results"></div>
							<li id="customer_history">
						</li>

						<!--<li id="customer_search_results"></li>-->

						<!--<li id="customer_history"></li>-->

						<li class="form-group input-group-lg">
							<label for="date"><h4>Date:</h4></label>
							<input type="text" name="date" class="date_field form-control appt-date-picker" id="date" readonly>
							<!-- http://eternicode.github.io/bootstrap-datepicker/?#sandbox -->
						</li>

						<li class="form-group">
							<table id="time-fields">
								<tr>
									<td><label for="start-time"><h4>Time:</h4></label></td>
									<td><button class="btn btn-default appt-time-arrow-btn" id="hour-up-arrow" onclick="return addApptHour()"><span class="glyphicon glyphicon-chevron-up appt-time-arrow-span"></span></button></td>
									<td><button class="btn btn-default appt-time-arrow-btn" id="min-up-arrow" onclick="return addApptMinutes()"><span class="glyphicon glyphicon-chevron-up appt-time-arrow-span"></span></button></td>
								</tr>

								<tr>
									<td class="input-group-lg time-field">
										<input type="text" class="appt-timepicker form-control" id="start-time" readonly>
									</td>
									<td class="input-group-lg hours-min-fields">
										<input type="text" class="form-control" id="appt-length-hours" value="0" disabled>
										<p class="time_label">H</p>
									</td>
									<td class="input-group-lg hours-min-fields">
										<input type="text" class="form-control" id="appt-length-mins" value="30" disabled>
										<p class="time_label">M</p>
									</td>
								</tr>

								<tr>
									<td></td>
									<td><button class="btn btn-default appt-time-arrow-btn" id="hour-down-arrow" onclick="return subtractApptHour()"><span class="glyphicon glyphicon-chevron-down appt-time-arrow-span"></span></button></td>
									<td><button class="btn btn-default appt-time-arrow-btn" id="min-down-arrow" onclick="return subtractApptMinutes()"><span class="glyphicon glyphicon-chevron-down appt-time-arrow-span"></span></button></td>
								</tr>
							</table>

							<!--Displayed if hours and mins both equal 0 -->
							<p id="appt-time-error" class="error_msg">Note: Invalid time entered</p>

						</li>

						<li>
							<label for="service-dropdown"><h4>Service:</h4></label>
							<div id="service-dropdown-area">
								<div class="one-service-dropdown form-group input-group-lg form-inline">
									<select name="service" id="service-dropdown" class="form-control field-dropdowns" onchange="checkSelectedService()">
										<option value=""></option>
										<!--Get options for service from database -->
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

		<!--This is the modal wrapper for the Add New Customer window -->
		<div id="modal_wrapper_new_customer" class="modal_wrapper">
			<div id="modal_new_customer">
				<div class="new_cust_header">
					<h3 id="new_cust_title">Add New Customer</h3><br/>
					<p id="new_cust_close"><a href="#" onclick="closeNewCustomerWindow()">Close[X]</a></p>
				</div>
				<!--action tells the browser where to send the form data when the form is submitted -->
				<!-- This form is set up as a table -->
				<!--<form id="new_customer_form" action="add_customer.php" method="post" onsubmit="return addNewCustomer()">-->
				<form id="new_customer_form" method="post">
					<table>
						<tbody id="new_customer_table">
							<tr>
								<!-- the for attribute must match the id attribute -->
								<td><label for="new_cust_name" id="new_cust_name_label">*Name:</label></td>
								<!--NOTE: The required attribute is not supported in Safari-->
								<td><input type="text" name="new_cust_name" id="new_cust_name" placeholder="Customer Name" class="form-control" required></td>
								<td class="right_col"><label for="new_cust_gender" id="new_cust_gender_label">Gender:</label></td>
								<td id="new_cust_gender_field">
									<label class="radio-inline"><input type="radio" name="new_cust_gender" value="Male">Male</label>
									<label class="radio-inline"><input type="radio" name="new_cust_gender" value="Female">Female</label>
								</td>
							</tr>
							<tr>
								<td><label for="new_cust_cell_phone" id="new_cust_cell_label">Cell Phone:</label></td>
								<td><input type="tel" id="new_cust_cell_phone"  placeholder="Cell Phone" class="form-control"></td>
								<td><label for="new_cust_home_phone" id="new_cust_home_phone_label" class="right_col">Home Phone:</label></td>
								<td><input type="tel" id="new_cust_home_phone"  placeholder="Home Phone" class="form-control"></td>
							</tr>
							<tr>
								<!--prefill email with "@" ?-->
								<td><label for="new_cust_email" id="new_cust_email_label">Email:</label></td>
								<td><input type="email" id="new_cust_email" placeholder="Email" class="form-control"></td>
								<td><label for="new_cust_address" id="new_cust_address_label" class="right_col">Home Address:</label></td>
								<td><input type="text" id="new_cust_address"  placeholder="Address" class="form-control"></td>
							</tr>
							<tr>
								<td><label for="new_cust_birthday">Birthday:</label></td>
								<td id="new_cust_birthday_row">
									<input type="text" id="new_cust_birthday" placeholder="Month/Day" class="form-control new_cust_birthday_field" readonly>
									<input type="text" id="new_cust_birthday_year" class="form-control" placeholder="Year" readonly></td>
								</td>
							</tr>
							<tr>
								<td><label for="new_cust_notes">Notes:</label></td>
								<td><textarea name="notes" id="new_cust_notes" class="form-control" rows="3" cols="10"></textarea></td>
								<td id="text_email_notify" colspan="2">
									<div id="new_cust_notification">
										<p id="notification_question">Would this customer like to be notified by</p>
										<div id="notification_options">
											<input type="checkbox" id="allow_text_check" name="allowText" value="true">Text<br><br>
											<input type="checkbox" id="allow_email_check" name="allowEmail" value="true">Email
										</div>
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					<div class="new_cust_more_fields">
						<p>* indicates a required field</p>
						<div id="make_appt_new_cust_question">
							<p>Make appointment with this new customer?</p>
							<input type="checkbox" id="make_appt_new_cust">Yes
						</div>
						<!--Leaving the fields regarding parent-child relationship out for now
						<div id="new_cust_children_question" class="form-group">
							<p>Does this customer have children?<p>
							<input type="checkbox" id="new_cust_has_children" name="newCustHasChildren" value="true">Yes
						</div>

						<div class="form-inline form-group add_new_cust_child_fields">
							<label for="new_cust_child_name">*Name:</label>
							<input type="text" id="new_cust_child_name" placeholder="Name" class="form-control">

							<label for="new_cust_child_gender">Gender:</label>
							<input type="radio" name="new_cust_child_gender" value="Male">M
							<input type="radio" name="new_cust_child_gender" value="Female">F

							<label for="new_cust_child_cell">Cell:</label>
							<input type="text" id="new_cust_child_cell" placeholder="Cell" class="form-control">

							<label for="new_cust_child_email">Email:</label>
							<input type="text" id="new_cust_child_email" placeholder="Email" class="form-control">

							<label for="new_cust_child_birthday">Birthday:</label>
							<input type="text" id="new_cust_child_birthday" placeholder="Birthday" class="form-control new_cust_birthday_field">

							user can click plus sign to add another line entry (another child)
							<a href="#" onclick="addNewCustChildLine()">
							<span class="glyphicon glyphicon-plus-sign" style="font-size:1.5em;"></span>
							</a>
						</div>

						<div id="new_cust_parent_question" class="form-group form-inline">
							<p>Is this customer the child of a parent?</p>
							<input type="checkbox" id="new_cust_has_parent" name="newCustHasParent" value="true">Yes
							<input type="text" class="form-control" id="cust_parent_name" placeholder="Parent's Name">
							<button type="button" class="btn btn-default" id="check_child_parent_button">Check</button>
						</div>
						-->
					</div>


					<!--<input type="submit" class="btn_default_cb" onclick="return addNewCustomer()" value="Add Customer">-->
					<button type="button" class="btn_default_cb" onclick="addNewCustomer()" id="addNewCustomerButton">Add Customer</button>
					<button type="button" class="btn_default_cb" id="clearNewCustFieldsButton" onclick="clearAddNewCustomerFields()">Clear Fields</button>
					<button type="button" class="btn_default_cb" id="closeNewCustButton" onclick="closeNewCustomerWindow()">Close</button>

					<!--<p id="reqrd_fields_msg" class="fields_missing_msg">Please enter all required fields</p>
					<p id="invalid_email_msg" class="fields_missing_msg">Email address entered is invalid</p>-->
					<div>
						<!--TO-DO: Fix these so they are all block-->
						<p id="reqrd_fields_msg" class="error_msg new_customer_error_msgs">Please enter all required fields</p>
						<p id="invalid_email_msg" class="error_msg new_customer_error_msgs">Please enter a valid email address</p>
						<p id="needs_email_msg" class="error_msg new_customer_error_msgs">Note: The customer needs an email address</p>
						<p id="needs_cell_msg" class="error_msg new_customer_error_msgs">Note: The customer needs a cell phone number</p>
					</div>
					<div id="add_customer_results"></div>
					<!--Does this need to be a form?-->
				</form>
			</div>
		</div>

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
	</body>

</html>
