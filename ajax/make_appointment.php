<!DOCTYPE HTML>
<html>
	<head>
	</head>

	<body>
		<?php
			require_once("common.php");
			require_once("customer_data.php");

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

			//Get id for customer from database
			$customerID_RS = getCustomerID($customerName);
			if(count($customerID_RS) == 1){
				$firstCust = $customerID_RS[0]['ID'];
				//make sure the ID is either a number or numeric string
				if(is_numeric($firstCust)){
					//TO-DO: Find out why this can be set here and referenced
					//from outside this scope
					$customerID = $firstCust;
				}
			}
			else{
				//echo "<p>No customer returned</p>";	
				//add red to customerName
			}

			//get id for employee
			$employeeID_RS = getEmployeeID($employeeName);
			if(count($employeeID_RS) == 1){
				$firstEmp = $employeeID_RS[0]['ID'];
				//make sure the ID is either a number or numeric string
				if(is_numeric($firstEmp)){
					$employeeID = $firstEmp;
				}
			}
			else{
				//echo "<p>No employee returned</p>";	
			}

			//Get service name
			$serviceName_RS = getServiceName($service);
			if (count($serviceName_RS) == 1) {
				$serviceName = $serviceName_RS[0]['Name'];
			}
			else{
				//echo "<p>No service returned</p>";
			}


			//echo "<p>Employee ID: " . $employeeID . "</p>";
			//echo "<p>Customer ID: " . $customerID . "</p>";	
			//echo "<p>Service Name: " . $serviceName . "</p>";
			//Insert into Appointment table
			addAppointment($apptDate, $customerID, $employeeID, $startTime, $endTime, $serviceName, $notes);

		?>
	</body>

</html>