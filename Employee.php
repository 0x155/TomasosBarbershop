<?php
  //Class storing methods for all methods relating to Employees
  require_once("common.php");
  require_once("Util.php");

  class Employee {
    public static function getEmployeeNames(){
      $connection = connect();

      $sql = "SELECT Name " .
           "FROM " . TBL_EMPLOYEE . " WHERE Unit_ID IS NOT NULL ORDER BY Unit_ID";

      try {
        $st = $connection->query($sql);

        $rs = $st->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rs as $employee) {
          echo "<option>" . $employee['Name'] . "</option>";
        }
      }
      catch(PDOException $e){
        Util::quit("getEmployeeNames", $e, $connection, false);
      }

      disconnect($connection);
    }

    /*
    Returns the ID of the entered employee from the Employee table.
    The ID is the primary key for the table and is needed when doing tasks such
    as inserting into the Appointment table.
    */
    public static function getEmployeeID($employeeNameIn){
      $connection = connect();

      $sql = "SELECT ID " .
           "FROM " . TBL_EMPLOYEE .
           " WHERE Name=:employeeName";

      try {
        $st = $connection->prepare($sql);
        $st->bindValue(":employeeName", $employeeNameIn, PDO::PARAM_STR);

        $st->execute();

        $rs = $st->fetch();
        return $rs['ID'];
      }
      catch(PDOException $e){
        Util::quit("getEmployeeID", $e, $connection, true);
      }

      disconnect($connection);
    }

    public static function getEmployeeUnitID($employeeNameIn){
      $connection = connect();

      $sql = "SELECT Unit_ID " .
           "FROM " . TBL_EMPLOYEE .
           " WHERE Name=:employeeName";

      try {
        $st = $connection->prepare($sql);
        $st->bindValue(":employeeName", $employeeNameIn, PDO::PARAM_STR);

        $st->execute();

        //use fetch() here since only one row is to be returned
        $rs = $st->fetch();
        return $rs['Unit_ID'];
      }
      catch(PDOException $e){
        Util::quit("getEmployeeUnitID", $e, $connection, true);
      }

      disconnect($connection);
    }
  }
 ?>
