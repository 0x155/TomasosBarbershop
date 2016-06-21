<?php
  /*
  This class contains methods for Customers
  */
  require_once("Util.php");

  class Customer {

		/*
		This function returns customer information (name, cell number, and email)
		based on customer name.
		*/
		public static function getCustomerInfoByName($customerName){

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
			}
			catch(PDOException $e){
				Util::quit("getCustomerInfo", $e, $connection, true);
			}

			disconnect($connection);
		}

    /*
    Queries for a customer given a cellphonenumber
    */
    public static function getCustomerInfoByCell($number) {
      $connection = connect();

      // Remove all symbols from the number entered by user
      $number = Util::stripPhoneNumber($number);

      $sql = "SELECT ID, Name, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, date_format(Birthday, \"%m/%d/%Y\") as Birthday, Notes " .
					"FROM " . TBL_CUSTOMER .
					" WHERE cellphonenumber=:cellphonenumber " .
					"ORDER BY Name ASC";

      try {
        $st = $connection->prepare($sql);
        $st->bindValue(":cellphonenumber", $number, PDO::PARAM_INT); //PARAM_STR?
        $st->execute();

        $rs = $st->fetchAll(PDO::FETCH_ASSOC);
        return $rs;

      }
      catch (PDOException $e) {
          Util::quit("getCustomerInfoByCell", $e, $connection, true);
      }

      disconnect($connection);

    }


    /*
    Updates customer info. Just Name, Email, CellPhoneNumber for now.
    */
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

		/*
		This will return either the most recent, or first visit date for a given
		customerID. Whether it is first or last depends on the value of $arg.
		*/
		public static function getVisitDate($arg, $customer_ID){
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
				// error_log($arg . " visit: " . $rs['visit_date']);
				return $rs['visit_date'];
			}
			catch(PDOException $e){
				Util::quit("getVisitDate", $e, $connection, true);
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
 ?>
