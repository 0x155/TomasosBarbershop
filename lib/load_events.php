<?php

	/* This PHP script loads data from the database to be displayed by the calendar
	The data that is retrieved includes the name of each of the units (employees),
	as well as the appointments from the Appointments table. */

	require("..\\common.php");
	require("dhtmlxScheduler_v4.2.0\codebase\connector\scheduler_connector.php");
	//require("dhtmlxScheduler_v4.2.0\codebase\connector\dataprocessor.php");

	error_log("Hi from load_events.php");

	//TO-DO: See if PDO can be used here, says some contants are not defined
	$res=mysql_connect("localhost","root","");
 	mysql_select_db("tomasosbarbershop_test");

 	//$res = connect();

 	//$dbtype = "MySQL";

	//need ID and Name from Employee table
	$list = new OptionsConnector($res);
	$list->render_table("Employee", "id", "id(value), name(label)");

	//error_log("List: " . $list);

	$calendar = new SchedulerConnector($res);
	$calendar->enable_log("log.txt",true); //error logging
	$calendar->set_options("EmployeeID", $list);
	$calendar->render_table("Appointment2", "id", "start_date, end_date, text, EmployeeID, CustomerID, Notes");

	
?>