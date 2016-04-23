<?php
	require_once("secrets.php");

	define("DB_DSN", "mysql:dbname=".$secrets["db_name"]);
	define("DB_USERNAME", $secrets["db_username"]); //$_SESSION['username']
	define("DB_PASSWORD", $secrets["db_password"]);
	define("TBL_CUSTOMER", "customer");
	define("TBL_APPOINTMENT", "appointment");
	define("TBL_APPOINTMENT_ORIG", "appointment_orig");
	define("TBL_EMPLOYEE", "employee");
	define("TBL_SERVICE", "service");
	define("TBL_PARENT", "parent");
	define("TBL_CHILD", "child");
	define("TBL_APPT_SERVICE", "appointment_service");
	define("TBL_APPT_SERVICE_ORIG", "appointment_service_orig");
	define("TBL_USER", "user");
?>
