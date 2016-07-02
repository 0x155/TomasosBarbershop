<?php
  /*
  This script inserts an employee into the database.
  This is done from a form in the Settings modal
  */

  require("Util.php");
  require_once("Employee.php");

  $employeeName = trim(htmlspecialchars($_POST['name']));
  $employee = array();

  if (strlen($employeeName) == 0) {
    // Set the HTTP response code to 400 - Bad Request if
    // user did not enter a name
    http_response_code(400);
    exit("Please enter a name");
  }

  // Push name into $employee array
  $employee["name"] = $employeeName;

  // User may or may not have passed a cellphonenumber
  // If they did, validate using Util::validatePhoneNumber method
  if (array_key_exists('cellphonenumber', $_POST)) {
    $employeeCellNumber = $_POST['cellphonenumber'];

    if (!Util::validatePhoneNumber($employeeCellNumber)) {
      http_response_code(400);
      exit("Please enter a valid cell phone number");
    }
    else {
      $employeeCellNumber = Util::stripPhoneNumber($employeeCellNumber);
      $employee["cellphonenumber"] = $employeeCellNumber;
    }
  }

  // Add to Employees table
  $inserted = Employee::addEmployee($employee);

  if ($inserted) {
    // returning what the user entered
    echo json_encode($employee);
  }
  else {
    http_response_code(400);
    exit("There was an error inserting the employee");
  }


?>
