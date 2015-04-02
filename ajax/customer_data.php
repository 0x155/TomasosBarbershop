<?php
	require_once("common.php");

	/*
	This function returns customer information (name, cell number, and email)
	*/
	function getCustomerInfo($customerName){

		$connection = connect();

		$sql = "SELECT Name, CellPhoneNumber, EmailAddress FROM " . TBL_CUSTOMER . 
				" WHERE Name LIKE :customerName";

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

?>