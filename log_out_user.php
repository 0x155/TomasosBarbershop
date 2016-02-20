<?php
	session_start();
	$_SESSION = array();
	if(session_destroy()){
		echo "true";
	}
	else{
		echo "false";
	}
?>