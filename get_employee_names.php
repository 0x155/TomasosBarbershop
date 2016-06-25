<?php
  /*
  This script will retrieve the names of all employees.
  This is executed when the Settings modal opens
  */

  require("Employee.php");
  require_once("Util.php");

  // Return a JSON string representation of the employees
  echo json_encode(Employee::getAllEmployeeNames());
?>
