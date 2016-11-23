<?php
	/*
	This PHP script will return a more detailed view of a customer's visit history.
	It will not return ALL the customer's history, since that may be a large amount of data.
	Returns a set number of rows. 
	*/
	require_once("common.php");
	require_once("Customer.php");
	require_once("Util.php");

	$connection = connect();

	$customerID = $_GET['customer']['ID'];
	//note, need to convert these to ints
	//Everything passed over HTTP is a string
	$startRow = (int)$_GET['startRow'];
	$numRows = (int)$_GET['numRows'];

	$rs = [];

	try{
		$rs = Customer::getFullCustomerHistory($customerID, $startRow, $numRows);

		echo json_encode($rs);

	}
	catch(PDOException $e){
		disconnect($connection);
		die("Failure in get_customer_history.php: " . $e->getMessage());
		error_log("Failure in get_customer_history.php: " . $e->getMessage());
	}

	disconnect($connection);
?>
