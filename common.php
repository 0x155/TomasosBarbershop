<?php
	require("config.php");
	require_once("Util.php");

	//connects to database, or fails if connection fails
	function connect(){
		try{
			$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);

			//This keeps the MySQL connection open for reuse by other parts of the app
			//false is the default, which opens and closes the connection each time
			$conn->setAttribute(PDO::ATTR_PERSISTENT, true);
			//This attribute tells PDO to throw exceptions on database errors, stopping the script if one occurs
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			//PDO::ATTR_EMULATE_PREPARES, false ??
		}
		catch(PDOException $e){
			Util::quit("connect", $e, $connection, true);
		}
		return $conn;
	}

	//pass-by-reference or value?
	function disconnect($conn){
		$conn = null;
	}

?>
