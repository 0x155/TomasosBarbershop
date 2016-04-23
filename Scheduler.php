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
		based on customer name.
		*/
		public static function getCustomerInfo($customerName){

			$connection = connect();

			$sql = "SELECT ID, Name, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, date_format(Birthday, \"%m/%d/%Y\") as Birthday, Notes " .
					"FROM " . TBL_CUSTOMER .
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
				Util::quit("getCustomerInfo", $e, $connection, true);
			}

			disconnect($connection);
		}


		public static function updateCustomerInfo($customer_id, $customer_name, $cell_phone_number, $email_addr){

			$connection = connect();

			$sql_update_query = "UPDATE ". TBL_CUSTOMER .
								" SET Name=:name, EmailAddress=:email, CellPhoneNumber=:phone_number " .
								"WHERE ID=:id";

			try{
				$st = $connection->prepare($sql_update_query);
				$st->bindValue(":id", $customer_id, PDO::PARAM_INT);
				$st->bindValue(":email", $email_addr, PDO::PARAM_STR);
				$st->bindValue(":phone_number", $cell_phone_number, PDO::PARAM_STR);
				$st->bindValue(":name", $customer_name, PDO::PARAM_STR);
				$st->execute();
				//rowCount() returns the # of affected rows
				return $st->rowCount();
			}
			catch(PDOException $e){
				Util::quit("updateCustomerInfo", $e, $connection, true);
			}

			disconnect($connection);
		}

		//This function adds a new customer to the database
		public static function addNewCustomer($name, $gender, $cell_phone_number, $home_number, $email_address, $home_address,
												$birthday, $notes, $allow_text, $allow_email){

			$connection = connect();

			$insert_customer_query = "INSERT INTO " . TBL_CUSTOMER . " (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress,
																		Birthday, Notes, AllowText, AllowEmail) " .
									"VALUES (:name, :gender, :cell_phone_number, :home_number, :email_address, :home_address, :birthday, :notes, :allow_text, :allow_email)";

			try{
				$st = $connection->prepare($insert_customer_query);
				$st->bindValue(":name", $name, PDO::PARAM_STR);
				$st->bindValue(":gender", $gender, PDO::PARAM_STR);
				$st->bindValue(":cell_phone_number", $cell_phone_number, PDO::PARAM_STR);
				$st->bindValue(":home_number", $home_number, PDO::PARAM_STR);
				$st->bindValue(":email_address", $email_address, PDO::PARAM_STR);
				$st->bindValue(":home_address", $home_address, PDO::PARAM_STR);

				//If birthday is empty string, then 0000-00-00 gets inserted as date.
				//If birthday is empty, bind it to null
				if(empty($birthday)){
					$st->bindValue(":birthday", null, PDO::PARAM_NULL);
				}
				else{
					$st->bindValue(":birthday", $birthday, PDO::PARAM_STR);
				}

				$st->bindValue(":notes", $notes, PDO::PARAM_STR);
				$st->bindValue(":allow_text", $allow_text, PDO::PARAM_STR);
				$st->bindValue(":allow_email", $allow_email, PDO::PARAM_STR);

				$ret = $st->execute();
				return $ret;
			}
			catch(PDOException $e){
				Util::quit("addNewCustomer", $e, $connection, true);
			}

			disconnect($connection);
		}

		/*
		This function returns a customer's recent visits.
		This query queries the Appointment_Services table, which lists the services in each appointment (for 1NF).
		As a result, each row will be a service and a date; therefore if an appointment has multiple services,
		there will be a row for each service. This is used to show a quick view of the customer's history.
		By default, the query returns the first 5 rows of the result.
		In SQL, LIMIT x, y
		Returns y number of rows starting with row number x+1 (the xth row is not shown)
		*/
		public static function getQuickCustomerHistory($customerID, $startRow=0, $numRows=5){

			$connection = connect();

			$query = "SELECT date_format(A.start_date, \"%m/%d/%Y\") as Appt_Date, E.Name as EmpName, AptSer.Service_Name as ServiceName, A.Notes " .
						"FROM " . TBL_APPOINTMENT . " AS A, " . TBL_EMPLOYEE . " AS E, " . TBL_APPT_SERVICE . " AS AptSer, " . TBL_CUSTOMER . " AS C " .
						"WHERE A.CustomerID = C.ID AND A.EmployeeID = E.ID AND A.ID = AptSer.Appt_ID  AND C.ID=:customer_ID " .
						"ORDER BY A.start_date DESC " .
						"LIMIT :startRow, :numRows";

			try{
				$st = $connection->prepare($query);
				$st->bindValue(":customer_ID", $customerID, PDO::PARAM_INT);
				$st->bindValue(":startRow", $startRow, PDO::PARAM_INT);
				$st->bindValue(":numRows", $numRows, PDO::PARAM_INT);

				$st->execute();

				$rs = $st->fetchAll(PDO::FETCH_ASSOC);
				return $rs;
			}
			catch(PDOException $e){
				Util::quit("getQuickCustomerHistory", $e, $connection, true);
			}

			disconnect($connection);
		}

		/*
		This function will query the Appointment table to get visits for a customer,
		given the customerID. This uses a different query than getQuickCustomerHistory.
		The query in getQuickCustomerHistory queries the Appointment_Services table,
		so each service for the appointment is a new row. This query queries the Appointment
		table, and will parse the Appointment.Text column to obtain a comma-seperated
		list of services for each appointment. This makes it easier to read in the
		"View All Customer History" modal
		*/
		public static function getFullCustomerHistory($customerName, $startRow=0, $numRows=5){

			$connection = connect();

			$customerID = Customer::getCustomerID($customerName);
			//error_log("Type of customerID: " . gettype($customerID));
			//SQL_CALC_FOUND_ROWS gets the total number of rows that would be returned w/out the LIMIT clause
			$get_history_query = "SELECT SQL_CALC_FOUND_ROWS date_format(A.start_date, \"%m/%d/%Y\") as Appt_Date, E.Name as EmpName, A.Text as Services, A.Notes " .
								"FROM " . TBL_APPOINTMENT . " AS A, " . TBL_EMPLOYEE . " AS E " .
								"WHERE A.CustomerID = " . $customerID . " AND E.ID = A.EmployeeID " .
								"ORDER BY A.start_date DESC " .
								"LIMIT :startRow, :numRows";

			//retrieves the total # of rows that would have been returned w/out the LIMIT clause
			$get_rows_query = "SELECT found_rows() as total_rows";

			try{
				$ret = array();

				//Prepare and run query to get visits
				$st = $connection->prepare($get_history_query);
				$st->bindValue(":startRow", $startRow, PDO::PARAM_INT);
				$st->bindValue(":numRows", $numRows, PDO::PARAM_INT);
				$st->execute();
				$rs = $st->fetchAll(PDO::FETCH_ASSOC);
				$ret[] = $rs;

				//Run query to return total number of rows
				//Dont need to prepare since there are no variables to plug in to query
				$st = $connection->query($get_rows_query);
				$rows = $st->fetch();
				$ret[] = $rows['total_rows'];

				return $ret;
			}
			catch(PDOException $e){
				Util::quit("getFullCustomerHistory", $e, $connection, true);
			}

			disconnect($connection);
		}

		//Get the first visit date for a customer
		//Get the last visit date for a customer
		/*
		This will return either the most recent, or first visit date for a given
		customerID. Whether it is first or last depends on the first argument.
		*/
		public static function getVistDate($arg, $customer_ID){
			//If the argument is "first", then return the first visit, so order date in ascending order
			//Else, return the most recent visit, so order date in descending order
			$order = ($arg == "first") ? "ASC": "DESC";
			$connection = connect();
			$sql = "SELECT date_format(start_date, \"%m/%d/%Y\") visit_date " .
					"FROM " . TBL_APPOINTMENT .
					" WHERE CustomerID=:customer_id " .
					"ORDER BY start_date " . $order . " LIMIT 1";
			try{
				$st = $connection->prepare($sql);
				$st->bindValue(":customer_id", $customer_ID, PDO::PARAM_INT);

				$st->execute();

				$rs = $st->fetch();
				error_log($arg . " visit: " . $rs['visit_date']);
				return $rs['visit_date'];
			}
			catch(PDOException $e){
				Util::quit("getVistDate", $e, $connection, true);
			}

			disconnect($connection);
		}

		/*
		Returns the ID of the entered customer from the Customer table.
		The ID is the primary key for the table and is needed when doing tasks such
		as creating an appointment

		WHY IS THIS NOT STATIC?
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

				$rs = $st->fetch();
				return $rs['ID'];
			}
			catch(PDOException $e){
				Util::quit("getCustomerID", $e, $connection, true);
			}

			disconnect($connection);
		}

		/*
		This function takes in a CustomerID and returns the cellphonenumber
		for that customer. This is returned to be displayed in the title
		of the lightbox
		*/
		public static function getCustomerCellPhoneNumber($id){
			$connection = connect();
			$sql = "SELECT CellPhoneNumber
					FROM " . TBL_CUSTOMER .
					" WHERE ID=:id";

			try {
				$st = $connection->prepare($sql);
				$st->bindValue(":id", $id, PDO::PARAM_INT);

				$st->execute();

				$rs = $st->fetch();
				return $rs['CellPhoneNumber'];
			}
			catch (PDOException $e) {
				//Do not exit here if there was an error - dont want to exit the script
				//just bc phone number wasnt available
				Util::quit("getCustomerCellPhoneNumber", $e, $connection, false);
			}

			disconnect($connection);
		}

		//check if customer exists in database
		public static function customerNameExists($customerName){
			$ret = false;
			$connection = connect();

			$sql = "SELECT COUNT(*) Count FROM " . TBL_CUSTOMER .
					" WHERE Name=:name";

			try {
				$st = $connection->prepare($sql);
				$st->bindValue(":name", $customerName, PDO::PARAM_STR);

				$st->execute();
				$numIDs = $st->fetch();
				$numCustomers = $numIDs['Count'];

				//Return true if 1 result returned, false otherwise
				if($numCustomers == "1"){
					$ret = true;
				}
				return $ret;
			}
			catch (PDOException $e) {
				Util::quit("customerNameExists", $e, $connection, false);
			}
			disconnect($connection);
		}
	}

	//Class storing methods for all methods relating to Services
	class Service{
		/* This function runs a query to get the names of all services.
		This is used to populate the options of the Type of Service dropdown. */
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
				//Do not exit here if there was an error - dont want to exit the script
				//just bc couldnt get services
				//Looks worse for the user if the script exits
				//note this also impacts the lightbox
				Util::quit("getServices", $e, $connection, false);
			}

			disconnect($connection);
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
			}
			catch(PDOException $e){
				Util::quit("getEmployeeNames", $e, $connection, false);
			}

			disconnect($connection);
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

				$rs = $st->fetch();
				return $rs['ID'];
			}
			catch(PDOException $e){
				Util::quit("getEmployeeID", $e, $connection, true);
			}

			disconnect($connection);
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

				//use fetch() here since only one row is to be returned
				$rs = $st->fetch();
				return $rs['Unit_ID'];
			}
			catch(PDOException $e){
				Util::quit("getEmployeeUnitID", $e, $connection, true);
			}

			disconnect($connection);
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

			try{
				$st = $connection->prepare($select_services_query);
				$st->bindValue(":appt_ID", $apptID, PDO::PARAM_INT);

				$st->execute();

				$rs = $st->fetchAll(PDO::FETCH_ASSOC);
				return $rs;
			}
			catch(PDOException $e){
				Util::quit("getServices", $e, $connection, false);
			}

			disconnect($connection);
		}
	}

	//This class stores functions related to the User table (login, update, etc)
	class User{
		public static function getUserInfo($username){
			try{
				$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);

				//This keeps the MySQL connection open for reuse by other parts of the app
				//false is the default, which opens and closes the connection each time
				$conn->setAttribute(PDO::ATTR_PERSISTENT, true);
				//This attribute tells PDO to throw exceptions on database errors, stopping the script if one occurs
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				//PDO::ATTR_EMULATE_PREPARES, false ??
			}
			catch(PDOException $e){
				Util::quit("connect", $e, $connection, true);
			}

			$select_password_query = "SELECT ID, Password FROM " . TBL_USER .
									" WHERE Username=:username";

			try{
				$st = $conn->prepare($select_password_query);
				$st->bindValue(":username", $username, PDO::PARAM_STR);

				$st->execute();

				$rs = $st->fetchAll(PDO::FETCH_ASSOC);
				return $rs;
			}
			catch(PDOException $e){
				Util::quit("getUserInfo", $e, $conn, true);
			}

			disconnect($conn);
		}

		public static function updateUserLastLogin($user_id, $date){
			$connection = connect();

			$update_login_query = "UPDATE " . TBL_USER .
									" SET LastLogin=:date ".
									" WHERE ID=:user_id";

			try{
				$st = $connection->prepare($update_login_query);
				$st->bindValue(":date", $date, PDO::PARAM_STR);
				$st->bindValue(":user_id", $user_id, PDO::PARAM_INT);
				$st->execute();
				return $st->rowCount();
			}
			catch(PDOException $e){
				Util::quit("updateUserLastLogin", $e, $connection, false);
			}

			disconnect($connection);
		}
	}

	//This class stores functions that are used throughout the app (not specific to Customers, Appointments, etc.)
	class Util{
		/*
		This function is used when getting full customer visit history.
		It parses the text field of an appointment - "Haircut -- Christian Bonacore"
		for example, to get the list of services for an appointment.
		Note the argument to explode is very critical. If for whatever reason the
		Appointment.Text field changes, the argument will need to change.
		*/
		public static function parseService($servicesIn){
			$parsed = explode(" --- ", $servicesIn);
			return current($parsed);
		}

		/*
		Returns true or false if a number is a valid phone number
		based on regex, and length of the string
		*/
		public static function validatePhoneNumber($number){
			//Remove dashes, open and closed parentheses, and spaces from the phone number
			$phone_number_symbols = array("-", "(", ")", " ");
			$number = str_replace($phone_number_symbols, "", $number);
			$phone_number_regex = "/[0-9]/";
			$ret = false;

			//If the $number string is empty, return true
			if(empty($number)){
				$ret = true;
			}

			//Phone number is valid if it contains all digits, and is of either length 7 or 10
			if( (preg_match($phone_number_regex, $number)) &&  ((strlen($number) == 7) || (strlen($number) == 10))   ){
				$ret = true;
			}

			return $ret;
		}


		public static function quit($functionName, $exception, $connection, $exit){
			error_log("Failure in ".$functionName."(): " . $exception->getMessage());
			disconnect($connection);
			if($exit){
				//Calling exit prints the message and then exits the current PHP script
				exit("<p class=\"ajax_error\">There was an error processing your request</p>");
			}
		}
	}

?>
