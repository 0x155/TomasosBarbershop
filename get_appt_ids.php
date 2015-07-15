<?php

	/*This script will return the IDs needed in order to schedule an appointment.
	This includes the Customer.ID, Employee.ID, and Employee.Unit_ID. 
	The script returns an associative array, encoded as a JSON object.
	If any of the queries return 0 results (for example if the customer entered does not
	exist in the database), then the JSON object will include an Error_Msgs key,
	whose value will be the error message.
	*/

	require_once("Scheduler.php");
	
	$customerName = $_POST['customerName'];
	$employeeName = $_POST['employeeName'];
	$service = $_POST['service'];

	$res = array();
	$error_string = "";
	$error = false;

	$empID_RS = Employee::getEmployeeID($employeeName); 
	$empUnitID_RS = Employee::getEmployeeUnitID($employeeName);
	//check size of these result sets
	//if 0, the employee does not exist
	$numEmpIDs = count($empID_RS);
	$numEmpUnitIDs = count($empUnitID_RS);

	if($numEmpIDs >= 1){
		$empID = $empID_RS[0]['ID'];
		$res["EmpID"] = $empID;
	}
	else{
		//Add message - "The Employee does not exist" to assoc array to be returned
		$error = true;
		$error_string .= "<h4 class=\"make_appt_bad\"><b>The employee does not exist</b></h4><br>";
	}

	if($numEmpUnitIDs >= 1){
		$empUnitID = $empUnitID_RS[0]['Unit_ID'];
		$res["EmpUnitID"] = $empUnitID;
	}
	else{
		//Add message - "The Employee is not assigned a column" to assoc array to be returned
		$error = true;
		$error_string .= "<h4 class=\"make_appt_bad\"><b>The employee is not assigned a column</b></h4><br>";
	}

	//if appointment is NOT Unavailable, then get customerID too
	if($service != "Unavailable"){
		$custID_RS = Customer::getCustomerID($customerName);

		//Note the query used in getCustomerID does NOT use WHERE NAME LIKE
		//it uses WHERE NAME=
		//therefore, unless two customers have the same name, then there will
		//only be either 1 or 0 results returned.
		//This is important since the user could just enter Rob
		//for the customer name, and then click Make Appointment 
		//(there could be multiple Robs)
		$numCustIDs = count($custID_RS);

		if($numCustIDs >= 1){
			$custID = $custID_RS[0]['ID'];
			//append customer.id to res		
			//unshift adds the element to the begining of the array
			//array_push appends the element to the end
			//array_unshift($res, "CustID" => $custID);
			$res["CustID"] = $custID;
		}
		else{
			$error = true;
			$error_string .= "<h4 class=\"make_appt_bad\"><b>The entered customer does not exist</b></h4><br>";
		}
	}
	else{
		//For Unavailable appointments, set the Customer.ID = 0
		//There is a record in the Customer table with ID=0 and
		//name="Unavailable". This allows the foreign key constraint not to fail
		$res["CustID"] = 0;
	}

	if($error){
		$res["Error_Msgs"] = $error_string;
	}

	//json_encodes returns a string containing the JSON
	//representation of $res (note it is just a string)
	echo json_encode($res); 
?>