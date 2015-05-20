<?php

	require_once("Customer.php");
	
	$customerNameIn = $_POST['name'];
	$rs = Customer::getCustomerID($customerNameIn);
	//Note the query used in getCustomerID does NOT use WHERE NAME LIKE
	//it uses WHERE NAME=
	//therefore, unless two customers have the same name, then there will
	//only be either 1 or 0 results returned.
	//This is important since the user could just enter Rob
	//for the customer name, and then click Make Appointment 
	//(there could be multiple Robs)

	$numResults = count($rs);

	if($numResults == 1){
		echo $rs[0]['ID'];
	}
	/*This would occur if the customer name entered does not exisit in the database,
	or if there are multiple customers with the same name. For example if just Rob was entered,
	and there are multiple Robs in the database.
	*/
	else{
		echo "<p class=\"make_appt_bad\"><b>Error with Customer Name</b></p><br>";
		echo "<p class=\"make_appt_bad\"><b>Use Search button to search for customer</b></p>";
	}
?>