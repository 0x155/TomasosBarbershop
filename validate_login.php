<?php
	require_once("Scheduler.php");

	$user_name = $_POST['username'];
	$password = $_POST['password'];
	
	//get hash for the entered username
	$user_info = User::getUserInfo($user_name);
	$user = current($user_info);
	$valid = password_verify($password, $user['Password']);

	if($valid){
		session_start();
		$_SESSION['logged_in'] = true;
		$_SESSION['username'] = $user_name;

		//Transaction for veriying the password, and then updating lastlogin?
		date_default_timezone_set('America/New_York');
		$date = date('Y-m-d H:i:s');
		$update_dates = User::updateUserLastLogin((int)$user['ID'], $date);
		echo "valid";
	}
	else{
		echo "<p>Invalid Username and Password</p>";
	}
?>