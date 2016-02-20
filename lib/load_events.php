<?php
	/* This PHP script loads data from the database to be displayed by the calendar
	The data that is retrieved includes the name of each of the units (employees),
	as well as the appointments from the Appointments table. */

	require("..\\common.php");
	require_once("..\\config.php");
	require("dhtmlxScheduler_v4.2.0\codebase\connector\scheduler_connector.php");
	require("dhtmlxScheduler_v4.2.0\codebase\connector\db_pdo.php");

	$res = connect();

	$list = new OptionsConnector($res, "PDO");
	//This query populates the names of the units (employee names), ordered by their unit_id, which is stored
	//in the database, and is DIFFERENT from the Employee.ID primary key
	//TO-DO: find a way to prevent against SQL injection here
	//might not be needed since there is no input from user is used to generate this query
	$list->render_complex_sql("SELECT unit_id as value, name as label FROM " . TBL_EMPLOYEE . " WHERE unit_id IS NOT NULL ORDER BY value", 
									"id", "unit_id(value), name(label)");


	/*
	The function below is attached to the afterInsert event.
	When a record is inserted into the Appointment table, this function is triggered.
	The function will parse the value of the Appointment.title column
	for the newly inserted row, and get the list of services for the new appointment. It will
	then insert a record for each service into the Appointment_Service table. This is done in
	order to normalize the database (1NF).
	http://docs.dhtmlx.com/connector__php__event_handling.html
	*/
	function insertIntoApptService($action){
		$apptID = $action->get_new_id();
		$apptText = $action->get_value("text");

		//apptText will be in the form "Service1, Service2 --- CustomerName"
		//the code below parses the string in order to get the list of services
		$dashIndex = strpos($apptText, " --- ");
		$servicesList = substr($apptText, 0, $dashIndex);
		$servicesArr = explode(", ", $servicesList);
		$numServices = count($servicesArr);

		//note using the global keyword here to reference the $calendar global variable
		//In PHP, all variables within user-defined functions have local scope,
		//therefore need to specify that this is the global variable, and not a new local one
		global $calendar;
		for($i = 0; $i < $numServices; $i++){
			//NOTE this does NOT have to be a seperate transaction, since the transaction mode is set to "global"
			//This forces all actions to be committed as one transaction
			//When the request is sent, it will include the INSERT INTO Appointment query, as well as the INSERT INTO Appt_Services queries

			//TO-DO: Work on preventing SQL injection here
			$query = "INSERT INTO ". TBL_APPT_SERVICE. " (Appt_ID, Service_Name) VALUES ($apptID, \"$servicesArr[$i]\")";
			$calendar->sql->query($query);
		}
	}

	$calendar = new SchedulerConnector($res, "PDO");
	
	//This allows actions to be commited as one transaction
	//Seperate transaction for each request
	//http://docs.dhtmlx.com/connector__php__complex_queries.html#transactions
	$calendar->sql->set_transaction_mode("global");
	
	//Attaches afterInsert event to a function which will insert records into Appointment_Services table
	$calendar->event->attach("afterInsert", "insertIntoApptService");

	//TO-DO: append today's date to log file name? that way its a new file each day
	$calendar->enable_log("log.txt",true);
	$calendar->set_options("Unit_ID", $list);
	$calendar->render_table("Appointment", "id", "start_date, end_date, text, EmployeeID, CustomerID, Notes, color, Unit_ID");
?>