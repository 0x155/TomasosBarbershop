<?php

	/*This script will return the IDs needed in order to schedule an appointment.
	This includes the Customer.ID, Employee.ID, and Employee.Unit_ID.
	The script returns an associative array, encoded as a JSON object.
	If any of the queries return 0 results (for example if the customer entered does not
	exist in the database), then the JSON object will include an Error_Msgs key,
	whose value will be the error message.
	*/

	require_once("Employee.php");
	require_once("Customer.php");

	$customerName = $_GET['customerName'];
	$employeeName = $_GET['employeeName'];
	$service = $_GET['service'];

	$res = array();
	$error_string = "";
	$error = false;

	$empID = Employee::getEmployeeID($employeeName);
	$empUnitID = Employee::getEmployeeUnitID($employeeName);

	if(strlen($empID) >= 1){
		$res["EmpID"] = $empID;
	}
	else{
		//Add message - "The Employee does not exist" to assoc array to be returned
		$error = true;
		$error_string .= "<h4 class=\"make_appt_bad ajax_error\"><b>The employee does not exist</b></h4><br>";
	}

	if(strlen($empUnitID) >= 1){
		$res["EmpUnitID"] = $empUnitID;
	}
	else{
		//Add message - "The Employee is not assigned a column" to assoc array to be returned
		$error = true;
		$error_string .= "<h4 class=\"make_appt_badajax_error\"><b>The employee is not assigned a column</b></h4><br>";
	}

	//if appointment is NOT Unavailable, then get customerID too
	if($service != "Unavailable"){
		$custID = Customer::getCustomerID($customerName);

		//Note the query used in getCustomerID does NOT use WHERE NAME LIKE
		//it uses WHERE NAME=
		//therefore, unless two customers have the same name, then there will
		//only be either 1 or 0 results returned.
		//This is important since the user could just enter Rob
		//for the customer name, and then click Make Appointment
		//(there could be multiple Robs)
		//$numCustIDs = count($custID_RS);

		if(strlen($custID) >= 1){
			//append customer.id to res
			//unshift adds the element to the begining of the array
			//array_push appends the element to the end
			//array_unshift($res, "CustID" => $custID);
			$res["CustID"] = $custID;
		}
		else{
			$error = true;
			$error_string .= "<h4 class=\"make_appt_bad ajax_error\"><b>The entered customer does not exist</b></h4><br>";
		}
	}
	else{
		//For Unavailable appointments, set the Customer.ID = 0
		//There is a record in the Customer table with ID=0 and
		//name="Unavailable". This allows the foreign key constraint not to fail
		//For "Unavailable", the customer is really the Employee
		$res["CustID"] = 0;
	}

	if($error){
		$res["Error_Msgs"] = $error_string;
	}

	//json_encodes returns a string containing the JSON
	//representation of $res (note it is just a string)
	echo json_encode($res);
?>
