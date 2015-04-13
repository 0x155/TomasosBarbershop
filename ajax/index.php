<html>
	<head>
		<meta charset="UTF-8">
		<title>XAMP Folder - Tomaso's Barbershop</title>

		<link rel="stylesheet" type="text/css" href="stylesheets\shop_stylesheet.css"/>
		<link rel="stylesheet" type="text/css" href="lib\bootstrap\css\bootstrap.min.css"/>
		<!-- full calendar 2.1.1 -->
		<!-- http://fullcalendar.io/ -->
		<!--<link rel="stylesheet" type="text/css" href="lib\fullcalendar-2.1.1\fullcalendar.css" />-->

		<!-- bootstrap version is 3.2 -->
		<!-- JQuery version is 2.1 -->
		<script type="text/javascript" src="jquery\jquery-2.1.1.js"></script>
		<script type="text/javascript" src="lib\bootstrap\js\bootstrap.js"></script>

		<!-- dhtmlx Scheduler -->
		<script type="text/javascript" src="lib\dhtmlxScheduler_v4.2.0\codebase\dhtmlxscheduler.js"></script>
		<script type="text/javascript" src="lib\dhtmlxScheduler_v4.2.0\codebase\ext\dhtmlxscheduler_units.js"></script>
		<link rel="stylesheet" href="lib\dhtmlxScheduler_v4.2.0\codebase\dhtmlxscheduler.css" type="text/css" />
		<!--<link rel="stylesheet" href="stylesheets\stylesheet_dhtmlx.css" type="text/css" />-->

		<!-- Bootstrap datepicker -->
		<!-- http://bootstrap-datepicker.readthedocs.org/en/release/ -->
		<script type="text/javascript" src="lib\bootstrap\datepicker\js\bootstrap-datepicker.js"></script>
		<link rel="stylesheet" type="text/css" href="lib\bootstrap\datepicker\css\datepicker.css"/>

		<!-- Bootstrap timepicker -->
		<!-- https://github.com/jdewit/bootstrap-timepicker -->
		<link rel="stylesheet" type="text/css" href="lib\bootstrap-timepicker\css\bootstrap-timepicker.min.css" />
		<script type="text/javascript" src="lib\bootstrap-timepicker\js\bootstrap-timepicker.min.js"></script>

		<!-- Javascript/JQuery written by CB -->
		<script type="text/javascript" src="lib\application_dhtmlx.js"></script>
		<script type="text/javascript" src="lib\ajax_functions.js"></script>
	</head>

	<body>
		
		<div class="grid">
			<!-- http://getbootstrap.com/css/#grid-options -->
			<div class="row">
				<div class="col-md-4 fields" id="field-column">
					<!-- action attribute tells the web browser where to send the data when form is submitted. Can be an absolute or relative URL-->
					<!-- method attribute tells browser how to send the data (GET/POST) -->
					<ul class="field_labels">
						<li>
							<label id="cust_name_label" for="customer_name"><h4>Customer Name:</h4></label>
							<div class="input-group input-group-lg" id="cust-name-fields">
								<input type="text" name="customer_name" placeholder="Customer Name" class="form-control" id="customer_name">
								<span class="input-group-btn">
									<button type="button" class="btn btn-default" name="cust-search-button" id="cust-search-button" onclick="customerSearch()">Search</button>
								</span>
							</div>
						</li>
						
						<li id="customer_search_results">
						</li>
					</ul>

					<!-- TO-DO: Might be able to make this one ul -->
					<form name="appointment_form" method="GET" action="" role="form">
						<ul class="field_labels">
							<li class="form-group input-group-lg">
								<label for="date"><h4>Date:</h4></label>
								<input type="text" name="date" class="date_field form-control" id="date">
								<!-- http://eternicode.github.io/bootstrap-datepicker/?#sandbox -->
							</li>

							<li class="form-group input-group-lg">
								<label for="start-time"><h4>Time:</h4></label>
								<input type="text" class="form-control appt-timepicker" id="start-time">
							</li>

							<!-- GET THE OPTIONS FOR THIS DROPDOWN FROM THE DB SO USER CAN ADD TYPES OF SERVICES -->
							<li>
								<label for="service-dropdown"><h4>Type of Service:</h4></label>
								<div id="service-dropdown-area">
									<div class="one-service-dropdown form-group input-group-lg form-inline">
										<select name="service" id="service-dropdown" class="form-control field-dropdowns">
											<option value=""></option>
											<option value="Haircut" id="haircut-option">Haircut</option>
											<option value="Beard Trim" id="beard-trim-option">Beard Trim</option>
											<option value="Shave" id="shave-option">Shave</option>
											<option value="Color" id="color-option">Color</option>
											<option value="Eyebrow Wax" id="eyebrow-wax-option">Eyebrow Wax</option>
											<option value="Unavailable" id="unavailable-option">Unavailable</option>
										</select>
										<!-- user can click plus sign to add another line entry (another service)-->
										<a href="#" onclick="addNewServiceLine()"><span class="glyphicon glyphicon-plus-sign" style="font-size:2.5em;top:12px;"></span></a>
									</div>	
								</div>
							</li>

							<!-- GET THE OPTIONS FOR THIS DROPDOWN FROM THE DB SO USER CAN ADD EMPLOYEES -->
							<li class="form-group input-group-lg">
								<label for="employee-dropdown"><h4>Employee:</h4></label>
								<select name="employee" id="employee-dropdown" class="form-control field-dropdowns">
									<option></option>
									<option>Kieron</option>
									<option>Tiara</option>
									<option>Doug</option>
									<option>Melvin</option>
									<option>Jackie</option>
								</select>
							</li>

							<!-- Only display this when the user selects "Unavailable" from Type of Service -->
							<!-- This will allow them to choose the start/end time the employee is unavailable,
							or be able to select that the employee is unavailable for the whole day -->
							<li id="unavailable-service">
								<label><input type="checkbox" id="unavailable-all-day">All Day</label>

								<div class="controls form-inline" id="unavailable-start-fields">
									<label class="control-label" for="unavailable-start-time">Start Time:</label>
									<input type="text" class="appt-timepicker" id="unavailable-start-time">
								</div>

								<div class="controls form-inline" id="unavailable-end-fields">
									<label class="control-label" for="unavailable-end-time">End Time:</label>
									<input type="text" class="appt-timepicker" id="unavailable-end-time">
								</div>
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
								<h4 id="make_appt_reqrd_fields_msg" class="fields_missing_msg">Please enter all required fields</h4>
							</li>
							

						</ul>
					</form>
				</div>

				<div class="col-md-7" id="calender-column">
					<!-- dhtmlx Scheduler verion 4.2-->
					<!-- This is the main calendar used  to schedule appointments -->
					<!-- http://docs.dhtmlx.com/scheduler/ -->
					<div id="scheduler_here" class="dhx_cal_container">
					    <div class="dhx_cal_navline">
					        <div class="dhx_cal_prev_button">&nbsp;</div>
					        <div class="dhx_cal_next_button">&nbsp;</div>
					        <!--
					        TO-DO: Add calendar icon to allow user to select date to view
					        <button type="button" class="btn btn-default btn-lg">
					        	<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
					        </button>
					        -->
					        <div class="dhx_cal_today_button"></div>
					        <div class="dhx_cal_date"></div>
					    </div>
					    <div class="dhx_cal_header"></div>
					    <div class="dhx_cal_data"></div>       
					</div>
				</div>
			</div>
		</div>

		<!--This is the modal wrapper for the Add New Customer window -->
		<div id="modal_wrapper_new_customer" class="modal_wrapper">
			<div id="modal_new_customer">
				<div class="new_cust_header">
					<h3 id="new_cust_title">Add New Customer</h3><br/>
					<p id="new_cust_close"><a href="#" onclick="toggleAddNewCustomerWindow()">close</a></p>
				</div>
				<!--action tells the browser where to send the form data when the form is submitted -->
				<!--TO-DO: Uncomment other line. Not submitting data for demo purposes -->
				<!-- This form is set up as a table -->
				<!--<form id="new_customer_form" action="" method="post" onsubmit="return addNewCustomer()">-->
				<form id="new_customer_form" action="" method="post">
					<table>
						<tbody id="new_customer_table">
							<tr>
								<!-- the for attribute must match the id attribute -->
								<td><label for="new_cust_name" id="new_cust_name_label">*Name:</label></td>
								<td><input type="text" id="new_cust_name" placeholder="Customer Name" class="form-control" autofocus></td>
								<td class="right_col"><label for="new_cust_gender" id="new_cust_gender_label">Gender:</label></td>
								<td id="new_cust_gender_field">
									<input type="radio" name="new_cust_gender" value="Male">Male</input>
									<input type="radio" name="new_cust_gender" value="Female">Female</input>
								</td>
							</tr>
							<tr>
								<td><label for="new_cust_cell_phone" id="new_cust_cell_label">*Cell Phone:</label></td>
								<td><input type="text" id="new_cust_cell_phone"  placeholder="Cell Phone" class="form-control"></td>
								<td><label for="new_cust_home_phone" id="new_cust_home_phone_label" class="right_col">Home Phone:</label></td>
								<td><input type="text" id="new_cust_home_phone"  placeholder="Home Phone" class="form-control"></td>
							</tr>					
							<tr>
								<!--prefill email with "@" ?-->
								<td><label for="new_cust_email" id="new_cust_email_label">Email:</label></td>
								<td><input type="text" id="new_cust_email" placeholder="Email" class="form-control"></td>
								<td><label for="new_cust_address" id="new_cust_address_label" class="right_col">Home Address:</label></td>
								<td><input type="text" id="new_cust_address"  placeholder="Address" class="form-control"></td>
							</tr>							
							<tr>
								<td><label for="new_cust_birthday">Birthday:</label></td>
								<td><input type="text" id="new_cust_birthday" placeholder="Birthday" class="form-control new_cust_birthday_field"></td>
							</tr>
							<tr>
								<td><label for="new_cust_notes">Notes:</label></td>
								<td><textarea name="notes" id="new_cust_notes" class="form-control" rows="3" cols="10"></textarea></td>
								<td id="text_email_notify" colspan="2">
									<div id="new_cust_notification">
										<p id="notification_question">Would this customer like to be notified by</p>
										<div id="notification_options">
											<input type="checkbox" id="allow_text_check" name="allowText" value="true">Text<br>
											<input type="checkbox" id="allow_email_check" name="allowEmail" value="true">Email
										</div>
									</div>
								</td>
							</tr>							
						</tbody>
					</table>

					<div class="new_cust_more_fields">
						<p>* indicates a required field</p>

						<!--span?-->
						<div id="make_appt_new_cust_question">
							<p>Make appointment with this new customer?</p>
							<input type="checkbox" id="make_appt_new_cust">Yes
						</div>

						<!--Ask if the new customer has children-->
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

							<!-- user can click plus sign to add another line entry (another child)-->
							<a href="#" onclick="addNewCustChildLine()">
							<span class="glyphicon glyphicon-plus-sign" style="font-size:1.5em;"></span>
							</a>
						</div>

						<div id="new_cust_parent_question" class="form-group form-inline">
							<p>Is this customer a child of a parent?</p>
							<input type="checkbox" id="new_cust_has_parent" name="newCustHasParent" value="true">Yes

							<!--<div class="input-group" id="cust-parent-input-group">-->
								<input type="text" class="form-control" id="cust_parent_name" placeholder="Parent's Name">
								<button type="button" class="btn btn-default" id="check_child_parent_button">Check</button>
							<!--</div>-->
						</div>



					</div>
					
					<p id="reqrd_fields_msg" class="fields_missing_msg">Please enter all required fields</p>
					<p id="invalid_email_msg" class="fields_missing_msg">Email address entered is invalid</p>

					<!--<input type="submit" class="btn_default_cb" value="Add Customer">-->
					<button type="button" class="btn_default_cb" onclick="addNewCustomer()" id="addNewCustomerButton">Add Customer</button>
					<button type="button" class="btn_default_cb" onclick="clearAddNewCustomerFields()" id="clearNewCustFieldsButton">Clear Fields</button>
				</form>
			</div>
		</div>

		<!--This modal wrapper will display the search results for a search
		which returns multiple customer results (partial match)-
		<div id="modal_wrapper_cust_search_results" class="modal_wrapper">
			<div id="modal_cust_search_results">
				<div id="cust_search_results_header">
					<h4>Search Results for</h4><h4 id="cust_search_name"></h4>
					<p id="cust_search_results_close"><a href="#" onclick="closeCustSearchResults()">close</a></p>
				</div>

				<button type="button" id="select_cust_results_btn" class="btn_default_cb" onclick="selectCustomer()">Select</button>
				<button type="button" id="edit_cust_results_btn" class="btn_default_cb">Edit</button>
				<p id="no_cust_selected_msg" class="fields_missing_msg">Please select a customer</p>
			</div>
		</div>
		-->

	</body>

</html>