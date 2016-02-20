<!DOCTYPE HTML>
<html>
	<head>
	</head>
	<!-- MAY NOT NEED THIS SCRIPT -->
	<body>
		<?php
			require_once("common.php");
			require_once("Scheduler.php");

			$connection = connect();

			//arguments from POST
			$apptDate = $_POST['date'];
			$customerName = $_POST['customerName'];
			$startTime = $_POST['startTime'];
			$endTime = $_POST['endTime'];
			$employeeName = $_POST['employeeName'];
			$services = $_POST['services'];
			$notes = $_POST['notes'];

			//explode creates an array of strings, with elements delimited by the "|"
			//"|" is used in the $services string in order to seperate the multiple services for each appointment
			$servicesArr = explode("|", $services);

			//Sets the FIRST_SERVICE constant to the first element in the
			//servicesArr array, as long as the length of the array is greater than 0
			if(count($servicesArr) > 0){
				define("FIRST_SERVICE", $servicesArr[0]);	
			}
			//else?

			$validFields = true;
			$errorMessage = "";

			//Get id for customer from database, only if service is not Unavailable (haircut, shave, etc.)
			//if it is Unavailable, then we dont need to check the customer's name since it does not matter
			if(FIRST_SERVICE !== "Unavailable"){
				$customerID_RS = Customer::getCustomerID($customerName);

				//TO-DO: WHAT IF TWO CUSTOMERS HAVE THE SAME NAME?
				//if more than 1 result is returned, then there are customers with the same name

				if(count($customerID_RS) == 1){

					$firstCust = $customerID_RS[0]['ID'];
					//make sure the ID is either a number or numeric string
					if(is_numeric($firstCust)){
						//TO-DO: Find out why $customerID can be set here and referenced
						//from outside this scope
						$customerID = $firstCust;
					}
				}
				else{
					$validFields = false;
					$errorMessage = "<p class=\"make_appt_bad\"><b>The customer entered does not exist</b></p>";
				}
			}
			//else if the service is Unavailable, set $customerID to null
			else{
				$customerID = null;
			}


			//get id for employee
			//this is needed for the INSERT INTO Appointment table
			$employeeID_RS = Employee::getEmployeeID($employeeName);
			if(count($employeeID_RS) == 1){
				$firstEmp = $employeeID_RS[0]['ID'];
				//make sure the ID is either a number or numeric string
				if(is_numeric($firstEmp)){
					$employeeID = $firstEmp;
				}
			}
			else{
				$validFields = false;
				$errorMessage .= "<p class=\"make_appt_bad\"><b>The employee entered does not exist</b></p>";
				//make field red?
			}

			//Insert into Appointment table if all fields are valid
			if($validFields){

				$success = Appointment::addAppointment($apptDate, $customerID, $employeeID, $startTime, $endTime, $notes, $servicesArr);	

				if($success){
					//echo "<p>Successful insert</p>";
					//bring up modal window with confirmation, display appointment info
				}
				else{
					echo "<p class=\"make_appt_bad\">Insert not successful</p>";
				}
			}
			else{
				echo $errorMessage;
			}
		?>
	</body>
</html>