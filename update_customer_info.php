<?php
	//This PHP script will updat the contact information for a customer
	//Just phone and email addr. for right now
	//This is done when the user updates customer info from the customer search results

	//require_once("config.php");
	require_once("common.php");

	$customerName = $_POST['customerName'];
	$phoneNumber = $_POST['phone'];
	$emailAddr = $_POST['email'];

	/*
	error_log("Hi from update customer info");
	error_log("Phone: " . $phoneNumber);
	error_log("Email: " . $emailAddr);
	error_log("Name: " . $customerName);
	*/
	
	$connection = connect();

	//Update customer
	$sql_update_query = "UPDATE ". TBL_CUSTOMER . " SET EmailAddress=:email, CellPhoneNumber=:phone " . 
						"WHERE Name=:name";

	try{
		$st = $connection->prepare($sql_update_query);
		$st->bindValue(":email", $emailAddr, PDO::PARAM_STR);		
		$st->bindValue(":phone", $phoneNumber, PDO::PARAM_STR);
		$st->bindValue(":name", $customerName, PDO::PARAM_STR);
		$st->execute();
		//rowCount() returns the # of affected rows
		//In this case, it should return 1
		echo $st->rowCount();
	}
	catch(PDOException $e){
		$connection->rollBack();
		disconnect($connection);
		error_log("Failure in update_customer_info: " . $e->getMessage());		
	}
?>