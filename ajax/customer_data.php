<?php
	require_once("common.php");

	/*
	This function returns customer information (name, cell number, and email)
	*/
	function getCustomerInfo($customerName){

		$connection = connect();

		$sql = "SELECT Name, CellPhoneNumber, HomePhoneNumber, EmailAddress, Birthday FROM " . TBL_CUSTOMER . 
				" WHERE Name LIKE :customerName " .
				"ORDER BY Name ASC";

		try{
			$st = $connection->prepare($sql);
			$customerName = "%$customerName%";
			$st->bindValue(":customerName", $customerName, PDO::PARAM_STR);

			$st->execute();
			
			$rs = $st->fetchAll(PDO::FETCH_ASSOC);
			return $rs;
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
	function getCustomerHistory($customerName){
		$connection = connect();

					//use an alias for Employee.Name and Service.Name since both columns are the same name
		$sql = "SELECT A.Appt_Date, E.Name as EmpName, S.Name as ServiceName, A.Notes " .
				"FROM " . TBL_APPOINTMENT . " AS A, " . TBL_EMPLOYEE . " AS E, " . TBL_SERVICE . " AS S, " . TBL_CUSTOMER . " AS C " .
				"WHERE A.CustomerID = C.ID AND A.ServiceName = S.Name AND A.EmployeeID = E.ID AND C.Name=:customerName " .
				"ORDER BY A.Appt_Date DESC";

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
	as inserting into the Appointment table.
	*/
	function getCustomerID($customerNameIn){
		$connection = connect();

		$sql = "SELECT ID " .
			   "FROM " . TBL_CUSTOMER . 
			   " WHERE Name=:customerName";

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

	/*
	Returns the ID of the entered employee from the Employee table.
	The ID is the primary key for the table and is needed when doing tasks such
	as inserting into the Appointment table.
	TO-DO: Create Employee class and put this method in that class
	*/
	function getEmployeeID($employeeNameIn){
		$connection = connect();

		$sql = "SELECT ID " .
			   "FROM " . TBL_EMPLOYEE . 
			   " WHERE Name=:employeeName";

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

	/*
	Verifies a service exists in the Service table.
	TO-DO: Put this in a different class or file.
	*/
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

	function addAppointment($apptDate, $customerID, $employeeID, $startTime, $endTime, $serviceName, $notes){
		$connection = connect();

		$sql = "INSERT INTO " . TBL_APPOINTMENT .
			"(Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) " . 
			"VALUES (:apptDate, :customerID, :employeeID, :startTime, :endTime, :serviceName, :notes)";

		try {
			$st = $connection->prepare($sql);
			$st->bindValue(":apptDate", $apptDate, PDO::PARAM_STR);
			$st->bindValue(":customerID", $customerID, PDO::PARAM_INT);
			$st->bindValue(":employeeID", $employeeID, PDO::PARAM_INT);
			$st->bindValue(":startTime", $startTime, PDO::PARAM_STR);
			$st->bindValue(":endTime", $endTime, PDO::PARAM_STR);
			$st->bindValue(":serviceName", $serviceName, PDO::PARAM_STR);
			$st->bindValue(":notes", $notes, PDO::PARAM_STR);

			$st->execute();
			
			//$rs = $st->fetchAll(PDO::FETCH_ASSOC);
			//return $rs;
		}
		catch(PDOException $e){
			disconnect($connection);
			die("Failure in addAppointment(): " . $e->getMessage());
		}			
	}

?>