<?php
	require_once("common.php");

	//Class storing methods for all methods relating to Services
	class Service{
		/* This function runs a query to get the names of all services.
		This is used to populate the options of the Type of Service dropdown. */
		public static function getServices(){
			$connection = connect();

			$sql = "SELECT Name " .
				   "FROM " . TBL_SERVICE . 
				   " ORDER BY Name ASC";

			try {
				$st = $connection->query($sql);
				$rs = $st->fetchAll(PDO::FETCH_ASSOC);

				foreach ($rs as $service) {
					echo "<option>" . $service['Name'] . "</option>";
				}

				disconnect($connection);

			}
			catch(PDOException $e){
				disconnect($connection);
				die("Failure in getServices(): " . $e->getMessage());
			}

		}
	}

	//Class storing methods for all methods relating to Employees
	class Employee{
		public static function getEmployeeNames(){
			$connection = connect();

			$sql = "SELECT Name " .
				   "FROM " . TBL_EMPLOYEE;

			try {
				$st = $connection->query($sql);
				
				$rs = $st->fetchAll(PDO::FETCH_ASSOC);

				foreach ($rs as $employee) {
					echo "<option>" . $employee['Name'] . "</option>";
				}

				disconnect($connection);

			}
			catch(PDOException $e){
				disconnect($connection);
				die("Failure in getEmployeeNames(): " . $e->getMessage());
			}

		}

		/*
		Returns the ID of the entered employee from the Employee table.
		The ID is the primary key for the table and is needed when doing tasks such
		as inserting into the Appointment table.
		*/
		public static function getEmployeeID($employeeNameIn){
			$connection = connect();

			$sql = "SELECT ID " .
				   "FROM " . TBL_EMPLOYEE . 
				   " WHERE Name=:employeeName";

				   //WHAT IF TWO EMPLOYEES HAVE THE SAME NAME?

			try {
				$st = $connection->prepare($sql);
				$st->bindValue(":employeeName", $employeeNameIn, PDO::PARAM_STR);

				$st->execute();
				
				$rs = $st->fetchAll(PDO::FETCH_ASSOC);
				return $rs;
			}
			catch(PDOException $e){
				disconnect($connection);
				die("Failure in getEmployeeID(): " . $e->getMessage());
			}
		}
	}

	//Class storing methods for all methods relating to Appointments
	class Appointment
	{
		/*
		Adds an appointment to the database.
		Uses a transaction to insert into the Appointment table, and also the Appointment_Service table.
		*/
		public static function addAppointment($apptDate, $customerID, $employeeID, $startTime, $endTime, $notes, $services){
			$connection = connect();

			$sql_insert_appointment = "INSERT INTO " . TBL_APPOINTMENT .
				"(Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, Notes) " . 
				"VALUES (:apptDate, :customerID, :employeeID, :startTime, :endTime, :notes)";

			$sql_insert_appt_services = "INSERT INTO " . TBL_APPT_SERVICE .
										"(Appt_ID, Service_Name) " .
										"VALUES(:apptID, :serviceName)";

			$ret = true;

			/*
			Using a transaction here since there are multiple Insert statements which need to be run:
			1. Insert into Appointment table
			2. Insert into Appointment_Service table for each type of service for the appointment
			Could be multiple inserts for no. 2, if the appointment has multiple services (ex. Haircut and Beard Trim)
			The use of a transaction allows for atomicity. If one of the inserts fail, then the rollback undoes the inserts 
			that were successful. Need to make sure all inserts are run successfully in order
			to maintain integrity of the data (can't have a record in Appointment and not Appointment_Service).
			*/
			$connection->beginTransaction();

			try {
				//bindParam instead?
				//INSERT INTO Appointment
				$st = $connection->prepare($sql_insert_appointment);
				$st->bindValue(":apptDate", $apptDate, PDO::PARAM_STR);
				$st->bindValue(":customerID", $customerID, PDO::PARAM_INT);
				$st->bindValue(":employeeID", $employeeID, PDO::PARAM_INT);
				$st->bindValue(":startTime", $startTime, PDO::PARAM_STR);
				$st->bindValue(":endTime", $endTime, PDO::PARAM_STR);
				$st->bindValue(":notes", $notes, PDO::PARAM_STR);
				$st->execute();

				$lastAppointmentID = $connection->lastInsertID();


				//INSERT INTO Appointment_Service
				$st = $connection->prepare($sql_insert_appt_services);
				$numServices = count($services);
				for($i = 0; $i < $numServices; $i++){
					//bind value and execute query
					$st->bindValue(":apptID", $lastAppointmentID, PDO::PARAM_INT);
					$st->bindValue(":serviceName", $services[$i], PDO::PARAM_STR);
					$st->execute();
				}

				$connection->commit();

				return $ret;
				
			}
			catch(PDOException $e){
				$connection->rollBack();
				disconnect($connection);
				die("Failure in addAppointment(): " . $e->getMessage());
			}			
		}
	}

		/*
	Verifies a service exists in the Service table.
	TO-DO: Put this in a different class or file.
	
	function getServiceName($serviceNameIn){
		$connection = connect();

		$sql = "SELECT Name " .
			   "FROM " . TBL_SERVICE . 
			   " WHERE Name=:serviceName";

		try {
			$st = $connection->prepare($sql);
			$st->bindValue(":serviceName", $serviceNameIn, PDO::PARAM_STR);

			$st->execute();
			
			$rs = $st->fetchAll(PDO::FETCH_ASSOC);
			return $rs;
		}
		catch(PDOException $e){
			disconnect($connection);
			die("Failure in getServiceName(): " . $e->getMessage());
		}
	}
	*/

?>