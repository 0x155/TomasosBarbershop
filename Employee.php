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

    // Returns ALL employee names, not just ones with a Unit_ID
    public static function getAllEmployeeNames() {
      $connection = connect();

      $sql = "SELECT id, Name, Unit_ID " .
           "FROM " . TBL_EMPLOYEE;

      try {
        $st = $connection->query($sql);

        $rs = $st->fetchAll(PDO::FETCH_ASSOC);

        return $rs;
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

    // Add Employee to database
    public static function addEmployee($employee) {
      $connection = connect();

      $includesCell = false;

      /*
      INSERT INTO Employees (name, cellphonenumber)
      VALUES ("Christian", "63144445555")
      */

      if (array_key_exists('cellphonenumber', $employee)) {
        $includesCell = true;
        $fields = "(name, cellphonenumber)";
        $values = ":name, :cellphonenumber";
      }
      else {
        $fields = "(name)";
        $values = ":name";
      }

      try {
        $sql = "INSERT INTO " . TBL_EMPLOYEE . $fields .
                " VALUES (" . $values . ")";

        $st = $connection->prepare($sql);
				$st->bindValue(":name", $employee['name'], PDO::PARAM_STR);

        if ($includesCell) {
          $st->bindValue(":cellphonenumber", $employee['cellphonenumber'], PDO::PARAM_STR);
        }

        $ret = $st->execute();
        return $ret;
      }
      catch (PDOException $e) {
        Util::quit("addEmployee", $e, $connection, true);
      }
    }
  }
 ?>
