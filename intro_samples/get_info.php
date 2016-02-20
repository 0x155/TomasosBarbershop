<?php
	/* There are 3 APIs that can be used in order to connect to a MySQL database.
	-mysql
	-mysqli (i = improved)
	-PDO - PHP data objects
	The mysql extension is deprecated as of PHP version 5.5, and will be removed in the future.
	The advantage of PDO is that if you change from MySQL to another DBMS, there are very little changes,
	where if using MySQLi, the entire code needs to be re-written.
	http://dev.mysql.com/doc/apis-php/en/apis-php-mysqlinfo.api.choosing.html
	*/

	//sets constants. these should be placed in a seperate file,
	//also need a password for root user
	define("DB_DSN", "mysql:dbname=tomasosbarbershop_test");
	define("DB_USERNAME", "root"); 
	define("DB_PASSWORD", "");
	define("TBL_CUSTOMER", "Customer");	//uses a constant to reference table name 
	define("TBL_APPOINTMENT", "Appointment");
	define("TBL_EMPLOYEE", "Employee");
	define("TBL_SERVICE", "Service");



	//connects to database, or fails if connection fails
	function connect(){
		try{
			$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
			//This keeps the MySQL connection open for reuse by other parts of the app
			//false is the default, which opens and closes the connection each time
			$conn->setAttribute(PDO::ATTR_PERSISTENT, true);
			//This attribute tells PDO to throw exceptions on database errors
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);					
		}
		catch(PDOException $e){
			die("Connection failed: " . $e->getMessage());
		}
		return $conn;
	}

	//pass-by-reference or value?
	function disconnect($conn){
		$conn = "";
	}

	function getCustomers(){

		$connection = connect();

		$sql = "SELECT Name, CellPhoneNumber, EmailAddress FROM " . TBL_CUSTOMER;

		try{
			//dont need to prepare statement since no values are passed in
			$st = $connection->query($sql);
			$rs = array();
			$rs = $st->fetchAll(PDO::FETCH_ASSOC);	//tells fetchAll() to return an assoc array

			return $rs;
			/*
			foreach($rs as $customer){
				$name = $customer['Name'];
				$cell = $customer['CellPhoneNumber'];
				$email = $customer['EmailAddress'];

				echo $name . "  " . $cell . "  " . $email . "<br>";
			}
			*/
		}
		catch(PDOException $e){
			disconnect($connection);
			die("Failure in getCustomers(): " . $e->getMessage());
		}

		disconnect($connection);
	}

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

	function getCustomerHistory($customerName){
		$connection = connect();

					//use an alias for the employee name and service name since both are "name" in table
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