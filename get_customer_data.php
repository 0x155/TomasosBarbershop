<?php
	/*
	This PHP script will run when the user is searching for a customer from the main screen.
	A query will be run to retireve customer information based on the name enetered by the user. If there is one customer returned,
	then that customer's information (name, number, email) will be displayed, along with their visit history.
	If no results are returned, the user is prompted if they want to add a new user.
	If multiple results are returned, then a modal window appears with the results, and the user can select which customer to
	schedule the appointment with.
	*/
	require_once("common.php");
	require_once("Customer.php");
	require_once("Util.php");

	$connection = connect();

	// Value is what the user entered in the search bar
	// Type is the type of search they are doing (phone # or name)
	$value = $_POST['value'];
	$type = $_POST['type'];

	try{

		if ($type === 'number') {
			$rs = Customer::getCustomerInfoByCell($value);
		}
		elseif ($type === 'name') {
			$rs = Customer::getCustomerInfoByName($value);
		}

		$numResults = count($rs);

		//If there is one customer match, then show information, and history for that customer
		if($numResults === 1) {
			echo "<div class=\"customer-history\">";
				//show customer info (name, cell, and email)
				echo "<div class=\"customer-info form-inline\">";

				//TO-DO: only 1 customer should be returned, just use the first element in rs?
				foreach ($rs as $customer) {
					// If customer has a cell number in database,
					// add dashes so it is easier for user to read
					$cellNumber = $customer['CellPhoneNumber'];
					if (strlen($cellNumber) > 0) {
						$cellNumber = Util::formatPhoneNumber($cellNumber);
					}

					echo "<b>Phone:</b>" .
								"<input type=\"text\" class=\"edit-cust-info-field form-control\" " .
								"id=\"edit-cust-info-phone\" " .
								"value=\"" . htmlspecialchars_decode($cellNumber) . "\" disabled><br>";
					echo "<b>Email:</b> <input type=\"text\" class=\"edit-cust-info-field form-control\" id=\"edit-cust-info-email\" value=\"" . htmlspecialchars_decode($customer['EmailAddress']) . "\" disabled><br>";
					//customerid is written to a div here in order to have it if the user's information is updated
					echo "<div id=\"customer-id\">".$customer['ID']."</div>";
				}
					echo "<div id=\"cust_edit_info_results\"></div>";
					echo "<span>";
						echo "<a id=\"edit-cust-info-btn\" onclick=\"toggleEditCustInfoFields()\"><b>Edit Info</b></a>";
						echo "<button type=\"button\" class=\"btn_edit_cust_info btn_default_cb\" id=\"btn_save_cust_info\" onclick=\"updateCustomerInfo()\">Save</button>";
						echo "<a id=\"cust-history-close\"><b>Close[x]</b></a>";
					echo "</span>";
				echo "</div>";

				/*Need to set the value of the customer_name text field to be
				the returned name from the search, otherwise the user can make appointment
				with partial name that returned one match.
				This <scirpt> tag is inserted into the DOM, but is actually executed in the
				customerSearch() function after the result is returned. Loading script tags into
				the DOM does not execute JS scripts. JS eval method executes the JS.
				*/
				//need to reset pointer since the foreach loop used above advances the pointer with each iteration
				$returnedCustomer = reset($rs);
				$returnedCustomerName = $returnedCustomer['Name'];
				$returnedCustomerID = $returnedCustomer['ID'];

				echo "<script>".
						"document.getElementById(\"customer_name\").value=\"" . htmlspecialchars_decode($returnedCustomerName) . "\";" .
					"</script>";

			//also show customer visit history
			$customerHistory = Customer::getQuickCustomerHistory($returnedCustomerID);
			$first_visit_date = Customer::getVisitDate("first", $returnedCustomerID);
			$last_visit_date = Customer::getVisitDate("last", $returnedCustomerID);
			$numVisits = count($customerHistory);

			//only show this table if the customer has visited before
			//could be a new customer with no history, in which just the table headers would be displayed
			if($numVisits > 0){
				echo "<table class=\"customer-history-table\">";
					echo "<thead>";
						echo "<tr>";
							echo "<th id=\"date-head\">Date</th>";
							echo "<th id=\"emp-head\">Employee</th>";
							echo "<th id=\"service-head\">Service</th>";
						echo "</tr>";
					echo "</thead>";
					echo "<tbody>";
					foreach ($customerHistory as $visit) {
						echo "<tr>";
							echo "<td>" . $visit['Appt_Date'] . "</td>";
							echo "<td>" . $visit['EmpName'] . "</td>";
							echo "<td>" . $visit['ServiceName'] . "</td>";
						echo "</tr>";
					}
					echo "</tbody>";
				echo "</table>";
				echo "<br>";
				echo "<p><b>Most Recent Visit: </b>" . $last_visit_date ."</p>";
				echo "<p><b>First Visit: </b>" . $first_visit_date ."</p>";
				echo "<a href=\"#\" colspan=\"2\" onclick=\"viewCustomerHistory()\"><b>View All History</b></a>";
			}
			echo "</div>";

		}
		//No results returned, or if the name entered is empty
		else if (($numResults === 0) || (empty($value)) ){
			echo "<div id=\"no-customer-returned\">";
				echo "<p>This search returned no customers. Would you like to add a new customer?</p>";
				echo "<div class=\"btn-group\" role=\"group\">";
					echo "<button type=\"button\" class=\"btn_default_cb no-cust-btn\" id=\"no-cust-btn-yes\" onclick=\"openNewCustomerWindow()\">Yes</button>";
					echo "<button type=\"button\" class=\"btn_default_cb no-cust-btn\" id=\"no-cust-btn-no\">No</button>";
				echo "</div>";
			echo "</div>";
		}
		//If multiple results, show results in modal window
		else{
			echo "<div id=\"modal_wrapper_cust_search_results\" class=\"modal_wrapper\">";
				echo "<div id=\"modal_cust_search_results\">";
					echo "<div id=\"cust_search_results_header\">";
						echo "<h4>Search Results for  " . $value . "</h4>";
					echo "</div>";

					echo "<table id=\"cust_search_results_table\">";
						echo "<tbody>";
							foreach ($rs as $customer) {
								// If customer has a cell or home number in database,
								// add dashes so it is easier for user to read
								$cellNumber = $customer['CellPhoneNumber'];
								$homeNumber = $customer['HomePhoneNumber'];
								if (strlen($cellNumber) > 0) {
									$cellNumber = Util::formatPhoneNumber($cellNumber);
								}
								if (strlen($homeNumber) > 0) {
									$homeNumber = Util::formatPhoneNumber($homeNumber);
								}

								echo "<tr class=\"cust-search-row\">";
									echo "<td><input type=\"radio\" name=\"cust_name\" value=\"". $customer['Name'] ."\"></td>";
									echo "<td>" . $customer['Name'] . "</td>";
									echo "<td>" . $cellNumber . "</td>";
									echo "<td>" . $homeNumber . "</td>";
									echo "<td>" . $customer['EmailAddress'] . "</td>";
									echo "<td>" . $customer['HomeAddress'] . "</td>";
									echo "<td>" . $customer['Birthday'] . "</td>";
								echo "</tr>";
							}
						echo "</tbody>";
					echo "</table>";

					echo "<button type=\"button\" id=\"select_cust_results_btn\" class=\"btn_default_cb\" onclick=\"selectCustomer()\">Select</button>";
					echo "<button type=\"button\" class=\"btn_default_cb\" onclick=\"closeCustSearchResults()\">Close</button>";
					echo "<button type=\"button\" class=\"btn_default_cb\" onclick=\"openNewCustomerWindow()\">Add Customer</button>";
					echo "<p id=\"no_cust_selected_msg\" class=\"fields_missing_msg\">Please select a customer</p>";

				echo "</div>";
			echo "</div>";
		}

	}
	catch(PDOException $e){
		disconnect($connection);
		die("Failure in get_customer_data.php: " . $e->getMessage());
	}

	disconnect($connection);
?>
