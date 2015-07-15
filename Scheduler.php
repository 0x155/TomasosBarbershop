<?php

	/*
	This script contains commonly used classes for different aspects of the scheduler app.
	This includes the following classes:
	Customer
	Service
	Employee
	Appointment

	This script is mainly used as a resource and is not triggered by any function calls.
	*/

	require_once("common.php");

	//This Customer class contains any methods related to Customers (data, id, history, etc.)
	class Customer{

		/*
		This function returns customer information (name, cell number, and email)
		*/
		public static function getCustomerInfo($customerName){

			$connection = connect();

			$sql = "SELECT Name, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday FROM " . TBL_CUSTOMER . 
					" WHERE Name LIKE :customerName " .
					"ORDER BY Name ASC";

			try{
				$st = $connection->prepare($sql);
				$customerName = "%$customerName%";
				$st->bindValue(":customerName", $customerName, PDO::PARAM_STR);

				$st->execute();
				
				$rs = $st->fetchAll(PDO::FETCH_ASSOC);
				return $rs;
				/*
				if size of $rs is 1, then check if the customer is a parent or child:
				
				SELECT Parent_ID FROM Parent where Parent.customerid = customerid
				-if size of this is 1, then show children

				SELECT Child_ID FROM Children where Children.customerid = customerid
				-if size of this is 1, then show parent(s)
				*/
			}
			catch(PDOException $e){
				disconnect($connection);
				die("Failure in getCustomerInfo(): " . $e->getMessage());
			}

			disconnect($connection);
		}


		/*
		This function returns a customer's recent visits
		*/
		public static function getCustomerHistory($customerName){

			$connection = connect();

			//TO-DO: will need to change this query since using a different schema for appointment table
			$sql = "SELECT date_format(A.start_date, \"%m/%d\") as Appt_Date, E.Name as EmpName, AptSer.Service_Name as ServiceName, A.Notes " .
					"FROM " . TBL_APPOINTMENT . " AS A, " . TBL_EMPLOYEE . " AS E, " . TBL_APPT_SERVICE . " AS AptSer, " . TBL_CUSTOMER . " AS C " .
					"WHERE A.CustomerID = C.ID AND A.EmployeeID = E.ID AND A.ID = AptSer.Appt_ID  AND C.Name=:customerName " .
					"ORDER BY Appt_Date DESC " . 
					"LIMIT 5";

			try{
				$st = $connection->prepare($sql);
				$st->bindValue(":customerName", $customerName, PDO::PARAM_STR);

				$st->execute();
				
				$rs = $st->fetchAll(PDO::FETCH_ASSOC);
				return $rs;
			}
			catch(PDOException $e){
				disconnect($connection);
				die("Failure in getCustomerHistory(): " . $e->getMessage());
			}
			
			disconnect($connection);
		}

		/*
		Returns the ID of the entered customer from the Customer table.
		The ID is the primary key for the table and is needed when doing tasks such
		as creating an appointment
		*/
		function getCustomerID($customerNameIn){

			$connection = connect();

			$sql = "SELECT ID " .
				   "FROM " . TBL_CUSTOMER . 
				   " WHERE Name=:customerName";

				//WHAT IF TWO CUSTOMERS HAVE THE SAME NAME?
				//do not allow duplicate names

			try {
				$st = $connection->prepare($sql);
				$st->bindValue(":customerName", $customerNameIn, PDO::PARAM_STR);

				$st->execute();
				
				$rs = $st->fetchAll(PDO::FETCH_ASSOC);
				return $rs;
			}
			catch(PDOException $e){
				disconnect($connection);
				die("Failure in getCustomerID(): " . $e->getMessage());
			} 
		}
	}	

	//Class storing methods for all methods relating to Services
	class Service{
		/* This function runs a query to get the names of all services.
		This is used to populate the options of the Type of Service dropdown. 
		TO-DO: add a parameter to be the type of HTML element to return (li or option) */
		public static function getServices($element){
			$connection = connect();

			$sql = "SELECT Name " .
				   "FROM " . TBL_SERVICE . 
				   " ORDER BY Name ASC";

			try {
				$st = $connection->query($sql);
				$rs = $st->fetchAll(PDO::FETCH_ASSOC);

				foreach ($rs as $service) {
					echo "<".$element.">" . $service['Name'] . "</".$element.">";
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
				   "FROM " . TBL_EMPLOYEE . " WHERE Unit_ID IS NOT NULL ORDER BY Unit_ID";

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

		public static function getEmployeeUnitID($employeeNameIn){
			$connection = connect();

			$sql = "SELECT Unit_ID " .
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
				die("Failure in getEmployeeUnitID(): " . $e->getMessage());
			}			
		}
	}

	//Class storing methods for all methods relating to Appointments
	class Appointment
	{

		/*
		Queries the Appointment_Service table for the list of services for a given 
		Appointment ID
		*/
		public static function getServices($apptID){

			$connection = connect();

			$select_services_query = "SELECT Service_Name FROM " . TBL_APPT_SERVICE . 
									" WHERE Appt_ID=:appt_ID";

			//error_log("Hi from Appointment:getServices(), query: " . $select_services_query);

			try{
				$st = $connection->prepare($select_services_query);
				$st->bindValue(":appt_ID", $apptID, PDO::PARAM_INT);

				$st->execute();
				
				$rs = $st->fetchAll(PDO::FETCH_ASSOC);
				return $rs;				
			}
			catch(PDOException $e){
				disconnect($connection);
				die("Failure in getServices(): " . $e->getMessage());
			}
		}

		/*
		NOTE: THIS MAY NOT BE NEEDED ANYMORE SINCE USING ADDEVENT() FROM DHTMLX API
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

?>