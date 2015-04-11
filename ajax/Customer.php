<?php
	require_once("common.php");

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

				   //WHAT IF TWO CUSTOMERS HAVE THE SAME NAME?
				   /*
				   Make this query more specific:
				   select id from customer 
				   where name=name, id=id
				   */

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