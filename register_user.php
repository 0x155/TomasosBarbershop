<?php
	require_once("common.php");

	$user_name = $_POST['new_username'];
	$password = $_POST['new_password'];
	error_log("Hi from register user: " . $user_name . ", " . $password);

	$hash = password_hash($password, PASSWORD_DEFAULT);

	$connection = connect();

	$sql = "INSERT INTO User (Username, Password) VALUES(\"".$user_name."\", \"".$hash."\")";

	try{
		$st = $connection->prepare($sql);
		$ret = $st->execute();
		return $ret;
	}
	catch(PDOException $e){
		error_log("Failure in register_user(): " . $e->getMessage());
		disconnect($connection);
		die("Failure in register_user(): " . $e->getMessage());
	}

	disconnect($connection);

?>