<?php
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

			$sql = "SELECT A.Appt_Date, E.Name as EmpName, AptSer.Service_Name as ServiceName, A.Notes " .
					"FROM " . TBL_APPOINTMENT . " AS A, " . TBL_EMPLOYEE . " AS E, " . TBL_APPT_SERVICE . " AS AptSer, " . TBL_CUSTOMER . " AS C " .
					"WHERE A.CustomerID = C.ID AND A.EmployeeID = E.ID AND A.Appt_ID = AptSer.Appt_ID  AND C.Name=:customerName " .
					"ORDER BY A.Appt_Date DESC " . 
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
?>