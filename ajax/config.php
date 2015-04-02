<!--This is a config file used to declare constants used by application-->
<!--Might want to change the location of this file at go-live since it contains username/password for database -->
<?php
	define("DB_DSN", "mysql:dbname=tomasosbarbershop_test");
	define("DB_USERNAME", "root"); 
	define("DB_PASSWORD", "");
	define("TBL_CUSTOMER", "Customer");	
	define("TBL_APPOINTMENT", "Appointment");
	define("TBL_EMPLOYEE", "Employee");
	define("TBL_SERVICE", "Service");
	define("TBL_PARENT", "Parent");
	define("TBL_CHILD", "Child");
?>
