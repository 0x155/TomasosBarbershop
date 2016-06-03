<?php
	require_once("User.php");

	$user_name = $_POST['username'];
	$password = $_POST['password'];

	//get hash for the entered username
	$user_info = User::getUserInfo($user_name);
	$user = current($user_info);
	$valid = password_verify($password, $user['Password']);

	if($valid){
		setcookie('logged_in', "true", 0);
		setcookie('username', $user_name);

		date_default_timezone_set('America/New_York');
		$date = date('Y-m-d H:i:s');
		$update_dates = User::updateUserLastLogin((int)$user['ID'], $date);
		echo "valid";
	}
	else{
		echo "<p>Invalid Username and Password</p>";
	}
?>
