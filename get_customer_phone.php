<?php
	//This PHP script will query the database for a customer's phone number
	//The phone number is to be displayed in the title of the quick info content
	//allowing the user to easily see the customer's phone number
	require_once("Scheduler.php");
	require_once("config.php");

	$customerID = $_POST['cust_ID'];

	$customerPhone = Customer::getCustomerCellPhoneNumber($customerID);
	if(count($customerPhone) >= 1){
		$phoneNumber = $customerPhone[0]['CellPhoneNumber'];
		//error_log("Length of number: " . strlen($phoneNumber));
		echo $phoneNumber;
	}
	//no phone returned, no customer exists
	else{
		error_log("nothing returned from query");
	}
	
?>