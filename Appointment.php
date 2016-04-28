<?php
  //Class storing methods for all methods relating to Appointments
  require_once("Util.php");
  
  class Appointment {

    /*
    Queries the Appointment_Service table for the list of services for a given
    Appointment ID
    */
    public static function getServices($apptID){

      $connection = connect();

      $select_services_query = "SELECT Service_Name FROM " . TBL_APPT_SERVICE .
                  " WHERE Appt_ID=:appt_ID";

      try{
        $st = $connection->prepare($select_services_query);
        $st->bindValue(":appt_ID", $apptID, PDO::PARAM_INT);

        $st->execute();

        $rs = $st->fetchAll(PDO::FETCH_ASSOC);
        return $rs;
      }
      catch(PDOException $e){
        Util::quit("getServices", $e, $connection, false);
      }

      disconnect($connection);
    }
  }
 ?>
