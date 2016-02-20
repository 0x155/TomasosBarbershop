<!DOCTYPE html>
<html>
	<head>
		<title>Test with PHP</title>
	</head>
	<body>
		<h3>Note this is a test page to test PHP - MySQL connection</h3>

		

			<form name="inner_form" method="POST">
				<input type="text" name="cust_name" />
				<input type="submit" name="button_1" value="Click Here" \>
			</form>		

			<?php
				require_once('get_info.php');

				//$customers = array();
				if( (isset($_POST['cust_name'])) && !empty($_POST['cust_name'])){
					$customerName = $_POST['cust_name'];
					$customerInfo = getCustomerInfo($customerName);
					$numResults = count($customerInfo);

					if($numResults == 1){
			?>
						<h3><?php echo $customerName ?></h3>
						<table cellpadding="1" style="border:1px solid red">
							<tr>
								<th>Name</th>
								<th>Cell Number</th>
								<th>Email Address</th>
							</tr>
							<?php
							foreach ($customerInfo as $customer) {
							?>
							<tr>
								<td><?php echo $customer['Name']; ?></td>
								<td><?php echo $customer['CellPhoneNumber']; ?></td>
								<td><?php echo $customer['EmailAddress']; ?></td>
							</tr>
							<?php
							}
							?>
						</table>
						<!-- If more than 1 result, get customer history -->
						<?php
							$customerHistory = getCustomerHistory($customerName);
						?>
						<table cellpadding="1" style="border:1px solid red">
							<tr>
								<th>Date</th>
								<th>Employee</th>
								<th>Service</th>
								<th>Notes</th>
							</tr>
							<?php
							foreach ($customerHistory as $appt) {
							?>
								<tr>
									<td><?php echo $appt['Appt_Date']?></td>
									<td><?php echo $appt['EmpName']?></td>
									<td><?php echo $appt['ServiceName']?></td>
									<td><?php echo $appt['Notes']?></td>
								</tr>
							<?php
							}
							?>
						</table>
					<?php
					}
					//If multiple results are returned, show results
					else{
					?>
						<p>Multiple results returned</p>
					<?php
					}
					?>

				<?php				
				}
				?>
			
		<form name="outter_form" method="POST" action="make_appt.php">
			<label for="date"><h3>Date:</h3></label>
			<input type="text" name="appt_date">

			<label for="time"><h3>Time:</h3></label>
			<input type="text" name="appt_time">

			<br>
			<br>

			<input type="submit" name="main_button" value="Make Appointment">

			
		</form>


	
	</body>
</html>
