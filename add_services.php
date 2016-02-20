<?php
	require_once("common.php");	

	$services = $_POST['services'];

	//explode creates an array of strings, with elements delimited by the "|"
	//"|" is used in the $services string in order to seperate the multiple services for each appointment
	$servicesArr = explode("|", $services);

	$connection = connect();

	$sql_insert_appointment = "INSERT INTO " . TBL_EMPLOYEE .
		"(name, cellPhoneNumber, emailAddress) " . 
		"VALUES (:name, :cellPhoneNumber, :emailAddress)";
/*
		$name = "Guiseppe";
		$cellPhoneNumber = "631-999-1111";
		$emailAddress = "new.employee@gmail.com";

	$st = $connection->prepare($sql_insert_appointment);
	$st->bindValue(":name", $name, PDO::PARAM_STR);
	$st->bindValue(":cellPhoneNumber", $cellPhoneNumber, PDO::PARAM_INT);
	$st->bindValue(":emailAddress", $emailAddress, PDO::PARAM_INT);
	$st->execute();
*/


	$lastAppointmentID = $connection->lastInsertID();

	error_log("Last insert ID: " . $lastAppointmentID);

	disconnect($connection);
?>