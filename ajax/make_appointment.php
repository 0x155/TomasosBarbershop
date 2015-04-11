<!DOCTYPE HTML>
<html>
	<head>
	</head>

	<body>
		<?php
			require_once("common.php");
			require_once("customer_data.php");
			require_once("Customer.php");

			$connection = connect();

			//get arguments from POST
			$apptDate = $_POST['date'];
			$customerName = $_POST['customerName'];
			$startTime = $_POST['startTime'];
			$endTime = $_POST['endTime'];
			$employeeName = $_POST['employeeName'];
			$service = $_POST['service'];
			$notes = $_POST['notes'];

			/*
			echo "<p>Hi From make_appointment.php</p>";
			echo "<p>" . $apptDate . "</p>";
			echo "<p>" . $customerName . "</p>";
			echo "<p>" . $startTime . "</p>";
			echo "<p>" . $endTime . "</p>";
			echo "<p>" . $employeeName . "</p>";
			echo "<p>" . $service . "</p>";
			echo "<p>" . $notes . "</p>";
			*/

			$validFields = true;
			$errorMessage = "";

			//Get id for customer from database,
			//only if service is not Unavailable,
			//if it is, then we dont need to check the customer's name since it does not matter
			if($service !== "Unavailable"){
				//$customerID_RS = getCustomerID($customerName);
				$customerID_RS = Customer::getCustomerID($customerName);

				//WHAT IF TWO CUSTOMERS HAVE THE SAME NAME?

				if(count($customerID_RS) >= 1){

					//if more than 1 result is returned, then there are customers with the same name

					$firstCust = $customerID_RS[0]['ID'];
					//make sure the ID is either a number or numeric string
					if(is_numeric($firstCust)){
						//TO-DO: Find out why this can be set here and referenced
						//from outside this scope
						$customerID = $firstCust;
					}
				}
				else{
					$validFields = false;
					$errorMessage = "<p class=\"make_appt_bad\"><b>The customer entered does not exist</b></p>";
					//make field red?
				}
			}
			//else (if the service is Unavailable, set $customerID to null
			else{
				$customerID = null;
			}


			//get id for employee
			$employeeID_RS = getEmployeeID($employeeName);

			//WHAT IF TWO EMPLOYEES HAVE THE SAME NAME?

			if(count($employeeID_RS) >= 1){
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

			//Get service name
			$serviceName_RS = getServiceName($service);
			if (count($serviceName_RS) >= 1) {
				$serviceName = $serviceName_RS[0]['Name'];
			}
			else{
				$validFields = false;
				$errorMessage .= "<p class=\"make_appt_bad\"><b>The service entered is invalid</b></p>";
			}

			//Insert into Appointment table if all fields are valid
			if($validFields){
				//add boolean to make sure insert was successful
				$success = addAppointment($apptDate, $customerID, $employeeID, $startTime, $endTime, $serviceName, $notes);	

				if($success){
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