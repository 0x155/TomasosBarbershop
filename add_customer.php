<?php

	//This script will add a new customer into the database

	require_once("common.php");
	require_once("Util.php");
	require_once("Customer.php");

	$valid = true;
	$error_msgs = "";

	//Only use htmlspecialchars for fields the user enters with text
	//This includes name, cell/home number, email, home address, and notes
	//gender, birthday, and allowtext/email are entered via other controls
	$customer_name = htmlspecialchars($_POST['customer_name']);
	$gender = $_POST['gender'];
	//NOTE-trim only removes the begining and ending whitespace, not any in between
	$cell_number = trim(htmlspecialchars($_POST['cell_number']));
	$home_number = trim(htmlspecialchars($_POST['home_number']));
	$email_address = trim(htmlspecialchars($_POST['email']));
	$home_address = htmlspecialchars($_POST['home_address']);
	$birthday = $_POST['birthday'];
	$notes = htmlspecialchars($_POST['notes']);
	$allow_text = $_POST['allow_text'];
	$allow_email = $_POST['allow_email'];

	/*
	Validate the following:
	-Both Cell and Home numbers contain 10 or 7 digits, and no other characters asie from numbers
	-Email address
	-Required fields have length > 0
	-If AllowText is Yes, check for cell phone number
	-Same for Email and AllowEmail
	*/

	//Cell Phone
	//Use method from Util class to validate phone numbers
	if(!(Util::validatePhoneNumber($cell_number))){
		$valid = false;
		$error_msgs .= "<p class=\"ajax_error\">Please enter a valid Cell Phone Number</p><br>";
	}

	//Home Phone
	if(!(Util::validatePhoneNumber($home_number))){
		$valid = false;
		$error_msgs .= "<p class=\"ajax_error\">Please enter a valid Home Phone Number</p><br>";
	}

	//Email
	//Using PHP filter function to validate email address
	//http://php.net/filter_var
	//http://www.w3schools.com/php/php_form_url_email.asp
	if(!empty($email_address)){
		if(!filter_var($email_address, FILTER_VALIDATE_EMAIL)){
			$valid = false;
			$error_msgs .= "<p class=\"ajax_error\">Please enter a valid Email Address</p><br>";
		}
	}

	//Ensure required fields are not empty
	//This includes email if the new customer wants email reminders,
	//and cellphone number if the new customer wants to receive text notifcations
	//The required fields are added to an assoc. array, with their keys being
	//the name of the field, and the value being the actual value
	//Having the key provides a better message to the user if one is blank.
	$required_fields = array('Name' => $customer_name);
	if($allow_text == "T"){
		$required_fields['Cell Phone Number'] = $cell_number;
	}
	if($allow_email == "T"){
		$required_fields['Email Address'] =  $email_address;
	}

	foreach ($required_fields as $field_name => $value) {
		if(empty($value)){
			$valid = false;
			$error_msgs .=  "<p class=\"ajax_error\">Please enter a(n) " . $field_name . "</p><br>";
		}
	}

	//After validation, run method to insert into Customer table
	if($valid){

		//Check if customer exists already
		$customerExists = Customer::customerNameExists($customer_name);
		if($customerExists){
			$error_msgs .= "<p class=\"ajax_error\">A customer with that name already exists</p>";
			echo $error_msgs;
		}
		else{
			$added = Customer::addNewCustomer($customer_name, $gender, $cell_number, $home_number, $email_address, $home_address,
										$birthday, $notes, $allow_text, $allow_email);

			if($added){
				echo "success";
			}
			else{
				$error_msgs .= "<p class=\"ajax_error\">There was an error inserting the customer</p>";
				echo $error_msgs;
			}
		}
	}
	else{
		echo $error_msgs;
	}

?>
