<?php
	require("config.php");

	//connects to database, or fails if connection fails
	function connect(){
		try{
			//TO-DO: If using a login page, get the username from the login
			//page, and set $_SESSION['username'] equal to that value
			//Need to call session_start(); in order to do this
			$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);

			//This keeps the MySQL connection open for reuse by other parts of the app
			//false is the default, which opens and closes the connection each time
			$conn->setAttribute(PDO::ATTR_PERSISTENT, true);
			//This attribute tells PDO to throw exceptions on database errors, stopping the script if one occurs
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);		
			//PDO::ATTR_EMULATE_PREPARES, false ??			
		}
		catch(PDOException $e){
			die("Connection failed: " . $e->getMessage());
		}
		return $conn;
	}

	//pass-by-reference or value?
	function disconnect($conn){
		$conn = "";
	}

?>