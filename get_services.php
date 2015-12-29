<?php
	/*
	This PHP script gets the services for a specific appointment.
	It returns a string with "|" delimiting each service.
	This data is returned for the lightbox to display the list of services for a 
	particular appointment.
	*/
	require_once("Scheduler.php");

	$apptID = $_POST['apptID'];

	$services = Appointment::getServices($apptID);
	$numServices = count($services);
	$ret = "";
	$i = 0;
	
	//iterate through the result set containing the services
	//and assemble string with a "|"" seperating each service
	//this string will be returned to the callback function of the AJAX method
	while ($i < $numServices) {
		$serv = $services[$i]['Service_Name'];

		if($i < ($numServices - 1)){
			$ret .= $serv . "|";
		}
		else{
			$ret .= $serv;
		}

		$i = $i + 1;
	}

	echo $ret;
?>