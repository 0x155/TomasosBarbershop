<?php
	//This PHP script will updat the contact information for a customer
	//Just phone and email address for right now
	//This is done when the user updates customer info from the customer search results

	require_once("common.php");
	require_once("Customer.php");
	require_once("Util.php");

	$customer_ID = $_POST['customerID'];
	$customer_name = trim($_POST['customerName']);
	$cell_phone_number = htmlspecialchars($_POST['phone']);
	$email_addr = htmlspecialchars($_POST['email']);
	$valid = true;
	$error_msgs = array();

	//Validate phone number
	if( !(Util::validatePhoneNumber($cell_phone_number)) ){
		$valid = false;
		array_push($error_msgs, "Please enter a valid Cell Phone Number");
	}
	else {
		$cell_phone_number = Util::stripPhoneNumber($cell_phone_number);
	}

	//Validate Email
	//Using PHP filter function to validate email address
	//http://php.net/filter_var
	//http://www.w3schools.com/php/php_form_url_email.asp
	if(!empty($email_addr)){
		if(!filter_var($email_addr, FILTER_VALIDATE_EMAIL)){
			$valid = false;
			array_push($error_msgs, "Please enter a valid Email Address");
		}
	}

	if(empty($customer_name)){
		$valid = false;
		array_push($error_msgs, "Please enter a name for the customer");
	}

	if($valid){

		//check if customer exists
		//NEED TO FIRST VERIFY THAT THE NAME WAS MODIFIED, OTHERWISE WILL ALWAYS RETURN TRUE
		// Customer::customerNameExists($customer_name);

		$row_count = Customer::updateCustomerInfo($customer_ID, $customer_name, $cell_phone_number, $email_addr);
		echo $row_count;
	}
	else{
		echo json_encode($error_msgs);
	}
?>
