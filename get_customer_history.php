<?php
	/*
	This PHP script will return a more detailed view of a customer's visit history.
	Will return the HTML for a modal window with the results.
	It will not return ALL the customer's history, since that may be a large amount of data.
	*/
	require_once("common.php");
	require_once("Customer.php");
	require_once("Util.php");

	$connection = connect();

	$customerName = $_POST['customer_name'];
	//note, need to convert these to ints
	//Everything passed over HTTP is a string
	$startRow = (int)$_POST['start_row'];
	$numRows = (int)$_POST['num_rows'];

	try{
		//getFullCustomerHistory returns an array with 2 elements (the assoc. array of visits, and total_rows returned)
		//list() assigns variables to these 2 elements
		list($customerVisitHistory, $total_rows) = Customer::getFullCustomerHistory($customerName, $startRow, $numRows);
		$customerInfo = Customer::getCustomerInfoByName($customerName);

		//current returns the element in the array which the internal pointer is currently pointed to.
		//By default, it returns the first element inserted in the array if the pointer is not changed.
		//http://php.net/manual/en/function.current.php
		$custInfo = current($customerInfo);
		$first_visit_date = Customer::getVisitDate("first", (int)$custInfo['ID']);
		$last_visit_date = Customer::getVisitDate("last", (int)$custInfo['ID']);
		//TO-DO: make sure a result is returned first

		echo "<div id=\"modal_wrapper_cust_history\" class=\"modal_wrapper\">";
			echo "<div id=\"modal_cust_history\">";
				echo "<div id=\"cust_history_heading\">";
					echo "<h3>History for " . $customerName . "</h3>";
					//echo "<h3 id=\"cust_history_heading\">History for " . $customerName . "</h3>";
				echo "</div>";

				//display customer info (phone numbers, email, birthday, etc.)
				echo "<div id=\"history_cust_info\">";
					echo "<ul id=\"history_cust_info_list\">";
						//only display these fields if there is a value for them
						//dont want to display labels for fields which are blank, takes up space
						if(strlen($custInfo['CellPhoneNumber']) > 0){
						echo "<li><h4><b>Cell #: </b> " . Util::formatPhoneNumber($custInfo['CellPhoneNumber']) . "</h4></li>";
						}
						if(strlen($custInfo['HomePhoneNumber']) > 0){
						echo "<li><h4><b>Home #: </b>" . $custInfo['HomePhoneNumber'] . "</h4></li>";
						}
						if(strlen($custInfo['EmailAddress']) > 0){
						echo "<li><h4><b>Email: </b>" . $custInfo['EmailAddress'] . "</h4></li>";
						}
						if(strlen($custInfo['HomeAddress']) > 0){
						echo "<li><h4><b>Address: </b>" . $custInfo['HomeAddress'] . "</h4></li>";
						}
						if(strlen($custInfo['Birthday']) > 0){
						echo "<li><h4><b>Birthday: </b>" . $custInfo['Birthday'] . "</h4></li>";
						}
						if(strlen($custInfo['Notes']) > 0){
						echo "<li><h4><b>Notes: </b>" . $custInfo['Notes'] . "</h4></li>";
						}
						//Most recent visit date
						echo "<li><h4><b>Most recent appt: </b>" . $last_visit_date . "</h4></li>";
						//First visit date
						echo "<li><h4><b>First appt: </b>" . $first_visit_date . "</h4></li>";
						//Most seen stylist
						/*
						SELECT COUNT(*) num_visits, name FROM Employee, Appointment WHERE CustomerID=X AND Employee.ID=Appointment.EmployeeID
						GROUP BY EmployeeID ORDER BY num_visits DESC LIMIT 1;
						*/
					echo "</ul>";
				echo "</div>";

				echo "<div id=\"history_cust_history\">";
					echo "<table id=\"cust_history_table\">";
						echo "<tbody>";
							foreach ($customerVisitHistory as $visit) {
								$services = Util::parseService($visit['Services']);
								echo "<tr>";
								//TO-DO: htmlspecialchars()??
									echo "<td>" . $visit['Appt_Date'] . "</td>";
									echo "<td class=\"history_service_col\">" . $services . "</td>";
									echo "<td>" . $visit['EmpName'] . "</td>";
									echo "<td class=\"history_notes_col\">" . $visit['Notes'] . "</td>";
								echo "</tr>";
							}
						echo "</tbody>";
					echo "</table>";
					echo "<div class=\"history_button_group\">";
						//if startRow is 0, then starting at begining, and dont need Prev button
						if($startRow > 0){
						echo "<button type=\"button\" class=\"btn_default_cb modal_btns\" onclick=\"viewPrevHistory(".$startRow.",".$numRows.")\">".
								"<span class=\"glyphicon glyphicon-arrow-left\" aria-hidden=\"true\"></span> Prev".
							"</button>";
						}
						if(($startRow + $numRows) < $total_rows){
						echo "<button type=\"button\" class=\"btn_default_cb modal_btns\" onclick=\"viewNextHistory(".$startRow.",".$numRows.")\">Next ".
								"<span class=\"glyphicon glyphicon-arrow-right\" aria-hidden=\"true\"></span>".
							  "</button>";
						}
						echo "<button type=\"button\" class=\"btn_default_cb modal_btns\" onclick=\"closeCustSearchResults()\">Close</button>";
					echo "</div>";
				echo "</div>";


			echo "</div>";
		echo "</div>";
	}
	catch(PDOException $e){
		disconnect($connection);
		die("Failure in get_customer_history.php: " . $e->getMessage());
		error_log("Failure in get_customer_history.php: " . $e->getMessage());
	}

	disconnect($connection);
?>
