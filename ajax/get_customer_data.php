<!DOCTYPE html>
<html>
	<head>
	</head>

	<body>
		<?php
			require_once("common.php");
			require_once("customer_data.php");

			$connection = connect();

			$name = $_GET['name'];

			$sql = "SELECT Name, CellPhoneNumber, EmailAddress FROM " . TBL_CUSTOMER . 
					" WHERE Name LIKE :customerName";

			try{
				$st = $connection->prepare($sql);
				$customerName = "%$name%";
				$st->bindValue(":customerName", $customerName, PDO::PARAM_STR);

				$st->execute();
				
				$rs = $st->fetchAll(PDO::FETCH_ASSOC);
				//return $rs;
				$numResults = count($rs);

				//If there is one customer match, show information, and history for that customer
				if($numResults == 1) {
					echo "<div class=\"customer-history\">";
					//show customer info (name, cell, and email)
					foreach ($rs as $customer) {
						echo "<p><b>Name: </b>" . $customer['Name'] . "</p>";
						echo "<p><b>Phone: </b>" . $customer['CellPhoneNumber'] . "</p>";
						echo "<p><b>Email Address: </b>" . $customer['EmailAddress'] . "</p>";
						echo "<p><a id=\"cust-history-close\">Close</a></p>";
					}

					//also show customer history
					$returnedCustomerName = $rs[0]['Name'];
					$customerHistory = getCustomerHistory($returnedCustomerName);

					echo "<table class=\"customer-history-table\">";
					echo "<tr>";
						echo "<th id=\"date-head\">Date</th>";
						echo "<th id=\"emp-head\">Employee</th>";
						echo "<th id=\"service-head\">Service</th>";
					echo "</tr>";
					foreach ($customerHistory as $visit) {
						echo "<tr>";
							echo "<td>" . $visit['Appt_Date'] . "</td>";
							echo "<td>" . $visit['EmpName'] . "</td>";
							echo "<td>" . $visit['ServiceName'] . "</td>";
						echo "</tr>";
					}
					echo "</div>";

				}
				//No results returned
				else if ($numResults == 0){
					echo "<div id=\"no-customer-returned\">";
						echo "<p>This search returned no customers. Would you like to add a new customer?</p>";
						echo "<div class=\"btn-group\" role=\"group\">";
							echo "<button type=\"button\" class=\"btn_default_cb no-cust-btn\" id=\"no-cust-btn-yes\" onclick=\"toggleAddNewCustomerWindow()\">Yes</button>";
							echo "<button type=\"button\" class=\"btn_default_cb no-cust-btn\" id=\"no-cust-btn-no\" onclick=\"closeNoCustReturned()\">No</button>";
						echo "</div>";
					echo "</div>";
				}
				//If multiple results, show results in modal window
				else{

				}



			}
			catch(PDOException $e){
				disconnect($connection);
				die("Failure in getCustomerInfo(): " . $e->getMessage());
			}

			disconnect($connection);
		?>
	</body>
</html>