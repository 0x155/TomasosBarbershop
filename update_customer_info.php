<?php
	//This PHP script will updat the contact information for a customer
	//Just phone and email address for right now
	//This is done when the user updates customer info from the customer search results

	require_once("common.php");
	require_once("Scheduler.php");

	$customer_name = $_POST['customerName'];
	$cell_phone_number = htmlspecialchars($_POST['phone']);
	$email_addr = htmlspecialchars($_POST['email']);
	$valid = true;
	$error_msgs = "";
	
	//$connection = connect();

	//Validate phone number
	if( !(Util::validatePhoneNumber($cell_phone_number)) ){
		$valid = false;
		$error_msgs .= "<p class=\"ajax_error\">Please enter a valid Cell Phone Number</p><br>";
	}

	//Validate Email
	//Using PHP filter function to validate email address
	//http://php.net/filter_var
	//http://www.w3schools.com/php/php_form_url_email.asp
	if(!empty($email_addr)){
		if(!filter_var($email_addr, FILTER_VALIDATE_EMAIL)){
			$valid = false;
			$error_msgs .= "<p class=\"ajax_error\">Please enter a valid Email Address</p><br>";
		}
	}

	if($valid){
		$row_count = Customer::updateCustomerInfo($customer_name, $cell_phone_number, $email_addr);
		echo $row_count;
	}
	else{
		echo $error_msgs;
	}
?>