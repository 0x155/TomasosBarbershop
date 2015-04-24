<!DOCTYPE html>
<html>
	<head>
	</head>

	<body>
		<?php
			/*
			This PHP script will be run when the user is searching for a customer.
			A query will be run to retireve customer information based on the name enetered by the user. If there is one customer returned,
			then that customer's information (name, number, email) will be displayed, along with their visit history. 
			If no results are returned, the user is prompted if they want to add a new user.
			If multiple results are returned, then a modal window appears with the results, and the user can select which customer to 
			schedule the appointment with.
			*/
			require_once("common.php");
			//require_once("customer_data.php");
			require_once("Customer.php");

			$connection = connect();

			$name = $_POST['name'];

			try{

				$rs = Customer::getCustomerInfo($name);
				$numResults = count($rs);

				//If there is one customer match, then show information, and history for that customer
				if($numResults == 1) {
					echo "<div class=\"customer-history\">";
						//show customer info (name, cell, and email)
						echo "<div class=\"customer-info\">";
						foreach ($rs as $customer) {
							echo "<p><b>Name: </b>" . $customer['Name'] . "</p>";
							echo "<p><b>Phone: </b>" . $customer['CellPhoneNumber'] . "</p>";
							echo "<p><b>Email Address: </b>" . $customer['EmailAddress'] . "</p>";
						}
						echo "</div>";
						//echo "<p><a id=\"cust-history-close\">Close[x]</a></p>";

						/*Need to set the value of the customer_name text field to be
						the returned name from the search, otherwise the user can make appointment
						with partial name that returned one match. 
						This <scirpt> tag is inserted into the DOM, but is actually executed in the 
						customerSearch() function after the result is returned. Loading script tags into
						the DOM does not execute them.
						*/ 
						$returnedCustomerName = $rs[0]['Name'];
						echo "<script>".
								"document.getElementById(\"customer_name\").value=\"" . $returnedCustomerName . "\";" . 
							"</script>";
					
					//also show customer history
					//$customerHistory = getCustomerHistory($returnedCustomerName);
					$customerHistory = Customer::getCustomerHistory($returnedCustomerName);
					$numVisits = count($customerHistory);

					//only show this table if the customer has visited before
					//could be a new customer with no history
					//if($numVisits > 0){
						echo "<table class=\"customer-history-table\">";
							echo "<thead>";
								echo "<tr>";
									echo "<th id=\"date-head\">Date</th>";
									echo "<th id=\"emp-head\">Employee</th>";
									echo "<th id=\"service-head\">Service</th>";
									echo "<th><a id=\"cust-history-close\">Close[x]</a></th>";
								echo "</tr>";
							echo "</thead>";
							echo "<tbody>";
							foreach ($customerHistory as $visit) {
								echo "<tr>";
									//TO-DO: change format of date? Currently is YYYY-MM-DD
									echo "<td>" . $visit['Appt_Date'] . "</td>";
									echo "<td>" . $visit['EmpName'] . "</td>";
									echo "<td>" . $visit['ServiceName'] . "</td>";
								echo "</tr>";
							}
								echo "<tr>";
									echo "<td><a href=\"#\">View All History</a></td>";
								echo "</tr>";
							echo "</tbody>";
						echo "</table>";
					
					echo "</div>";

				}
				//No results returned
				else if ($numResults == 0){
					echo "<div id=\"no-customer-returned\">";
						echo "<p>This search returned no customers. Would you like to add a new customer?</p>";
						echo "<div class=\"btn-group\" role=\"group\">";
							echo "<button type=\"button\" class=\"btn_default_cb no-cust-btn\" id=\"no-cust-btn-yes\" onclick=\"toggleAddNewCustomerWindow()\">Yes</button>";
							echo "<button type=\"button\" class=\"btn_default_cb no-cust-btn\" id=\"no-cust-btn-no\">No</button>";
						echo "</div>";
					echo "</div>";
				}
				//If multiple results, show results in modal window
				//TO-DO: Allow user to navigate through results if more than 10 are returned
				else{
					echo "<div id=\"modal_wrapper_cust_search_results\" class=\"modal_wrapper\">";
						echo "<div id=\"modal_cust_search_results\">";
							echo "<div id=\"cust_search_results_header\">";
								echo "<h4>Search Results for  " . $name . "</h4>";
								echo "<p id=\"cust_search_results_close\"><a href=\"#\" onclick=\"closeCustSearchResults()\">close</a></p>";
							echo "</div>";

							echo "<table id=\"cust_search_results_table\">";
								echo "<thead>";
									echo "<tr class=\"top_row\">";
										echo "<th></th>";
										echo "<th>Name</th>";
										echo "<th>Cell #</th>";
										echo "<th>Home #</th>";
										echo "<th>Email</th>";
										echo "<th>Address</th>";
										echo "<th>Birthday</th>";
									echo "</tr>";
								echo "</thead>";
								echo "<tbody>";
									foreach ($rs as $customer) {
										echo "<tr class=\"cust-search-row\">";
											echo "<td><input type=\"radio\" name=\"cust_name\" value=\"". $customer['Name'] ."\"></td>";
											echo "<td>" . $customer['Name'] . "</td>";
											echo "<td>" . $customer['CellPhoneNumber'] . "</td>";
											echo "<td>" . $customer['HomePhoneNumber'] . "</td>";
											echo "<td>" . $customer['EmailAddress'] . "</td>";
											echo "<td>" . $customer['HomeAddress'] . "</td>";
											echo "<td>" . $customer['Birthday'] . "</td>";
										echo "</tr>";
									}
								echo "</tbody>";
							echo "</table>";

							echo "<button type=\"button\" id=\"select_cust_results_btn\" class=\"btn_default_cb\" onclick=\"selectCustomer()\">Select</button>";
							echo "<button type=\"button\" id=\"edit_cust_results_btn\" class=\"btn_default_cb\">Edit</button>";
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
	</body>
</html>