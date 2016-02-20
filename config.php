<?php
	define("DB_DSN", "mysql:dbname=tomasosbarbershop_test");
	//define("DB_DSN", "mysql:host=cvps6706735910.hostwindsdns.com;dbname=zadmin_tomasosbarbershopprod");

	//Have ROOT_USER and ROOT_PASSWORD variables set


	define("DB_USERNAME", "root"); //$_SESSION['username']
	define("DB_PASSWORD", "");
	define("TBL_CUSTOMER", "Customer");	
	define("TBL_APPOINTMENT", "Appointment");
	define("TBL_APPOINTMENT_ORIG", "Appointment_Orig");
	define("TBL_EMPLOYEE", "Employee");
	define("TBL_SERVICE", "Service");
	define("TBL_PARENT", "Parent");
	define("TBL_CHILD", "Child");
	define("TBL_APPT_SERVICE", "Appointment_Service");
	define("TBL_APPT_SERVICE_ORIG", "Appointment_Service_Orig");
	define("TBL_USER", "User");
?>