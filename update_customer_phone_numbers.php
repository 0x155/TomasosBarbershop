<?php
  /*
  This script was used to re-format the cell phone numbers in the Customer
  table by removing dashes and parentheses from the number. This was done
  to work on the phone number search.
  */
  require_once("config.php");
  require_once("common.php");

  $connection = connect();

  $cellPhoneQuery = "SELECT id, cellphonenumber " .
                      "FROM customer " .
                      "WHERE ((cellphonenumber IS NOT NULL) AND LENGTH(cellphonenumber) > 0)";

  $homePhoneQuery = "SELECT id, homephonenumber " .
                      "FROM customer " .
                      "WHERE ((homephonenumber IS NOT NULL) AND LENGTH(homephonenumber) > 0)";

  try {
    $st = $connection->prepare($homePhoneQuery);
    $st->execute();
    $rs = $st->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rs as $n) {
      updateNumber($n['homephonenumber'], $n['id']);
    }

  } catch (PDOException $e) {
    error_log("Error in updateCustomerPhoneNumbers -> " . $e->getMessage());
  }

  disconnect($connection);




  function updateNumber($number, $customerId) {
    global $connection;

    $phone_number_symbols = array("-", "(", ")", " ");
    $newNumber = str_replace($phone_number_symbols, "", $number);

    if (strlen($newNumber) == 7) {
      $newNumber = "631".$newNumber;
    }

    $updateNumberQuery = "UPDATE customer " .
                        "SET homephonenumber=".$newNumber .
                        " WHERE id=".$customerId;

    try {
      $st = $connection->prepare($updateNumberQuery);
      $st->execute();
    } catch (PDOException $e) {
      error_log("Error in updating number: " . $e->getMessage());
    }

  }


?>
