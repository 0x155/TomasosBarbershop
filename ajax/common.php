<?php
	require("config.php");

	//connects to database, or fails if connection fails
	function connect(){
		//error_log("Hello from common.connect()");
		try{
			$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);

			//This keeps the MySQL connection open for reuse by other parts of the app
			//false is the default, which opens and closes the connection each time
			$conn->setAttribute(PDO::ATTR_PERSISTENT, true);
			//This attribute tells PDO to throw exceptions on database errors
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);					
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