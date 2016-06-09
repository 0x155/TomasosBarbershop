<?php
  require_once("config.php");
  require_once("common.php");

  $connection = connect();

  $cellPhoneQuery = "SELECT cellphonenumber " .
                      "FROM customer " .
                      "WHERE ((cellphonenumber IS NOT NULL) AND LENGTH(cellphonenumber) > 0)";

  $homePhoneQuery = "SELECT homephonenumber " .
                      "FROM customer " .
                      "WHERE ((homephonenumber IS NOT NULL) AND LENGTH(homephonenumber) > 0)";

  try {
    $st = $connection->prepare($cellPhoneQuery);
    $st->execute();
    $rs = $st->fetchAll(PDO::FETCH_ASSOC);

  } catch (PDOException $e) {

  }

  disconnect($connection);

  function updateNumber($number) {
    $newNumber = str_replace()
  }


?>
