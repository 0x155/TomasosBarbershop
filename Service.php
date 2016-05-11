<?php
  //Class storing methods for all methods relating to Services
  require_once("common.php");
  require_once("Util.php");

  class Service {
    /* This function runs a query to get the names of all services.
    This is used to populate the options of the Type of Service dropdown. */
    public static function getServices($element){
      $connection = connect();

      $sql = "SELECT Name " .
           "FROM " . TBL_SERVICE .
           " ORDER BY Name ASC";

      try {
        $st = $connection->query($sql);
        $rs = $st->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rs as $service) {
          echo "<".$element.">" . $service['Name'] . "</".$element.">";
        }

        disconnect($connection);

      }
      catch(PDOException $e){
        //Do not exit here if there was an error - dont want to exit the script
        //just bc couldnt get services
        //Looks worse for the user if the script exits
        //note this also impacts the lightbox
        Util::quit("getServices", $e, $connection, false);
      }

      disconnect($connection);
    }
  }
 ?>
