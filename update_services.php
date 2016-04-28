<?php
	/*
	This PHP script will update the Appointment_Service table when the user
	changes the services for a particular appointment. Since there are 1 or more
	rows for each appointment in this table, the rows for the appointment are deleted,
	then new rows are inserted.
	*/
	require_once("config.php");
	require_once("common.php");

	$apptID = $_POST['apptID'];
	$services = $_POST['newSrvcs'];
	$servicesArr = explode(",", $services);

	$connection = connect();

	$sql_delete_stmt = "DELETE FROM " . TBL_APPT_SERVICE . " WHERE Appt_ID=:apptID";
	$sql_insert_stmt = "INSERT INTO " . TBL_APPT_SERVICE .
						"(Appt_ID, Service_Name) VALUES(:apptID, :serviceName)";

	$connection->beginTransaction();

	try{
		//First delete the rows for the appointment
		$st = $connection->prepare($sql_delete_stmt);
		$st->bindValue(":apptID", $apptID, PDO::PARAM_INT);
		$st->execute();

		//Insert new rows for the appointment
		$st = $connection->prepare($sql_insert_stmt);
		$st->bindValue(":apptID", $apptID, PDO::PARAM_INT);
		$numServices = count($servicesArr);
		for ($i=0; $i < $numServices; $i++) {
			$st->bindValue(":serviceName", $servicesArr[$i], PDO::PARAM_STR);
			$st->execute();
			error_log("Inserted service " . $servicesArr[$i]);
		}

		$connection->commit();
	}
	catch(PDOException $e){
		$connection->rollBack();
		disconnect($connection);
		error_log("Failure in update_services: " . $e->getMessage());
	}

?>
