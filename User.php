<?php
  //This class stores functions related to the User table (login, update, etc)
  require_once("common.php");
  require_once("Util.php");

  class User {
    public static function getUserInfo($username){
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

      $select_password_query = "SELECT ID, Password FROM " . TBL_USER .
                  " WHERE Username=:username";

      try{
        $st = $conn->prepare($select_password_query);
        $st->bindValue(":username", $username, PDO::PARAM_STR);

        $st->execute();

        $rs = $st->fetchAll(PDO::FETCH_ASSOC);
        return $rs;
      }
      catch(PDOException $e){
        Util::quit("getUserInfo", $e, $conn, true);
      }

      disconnect($conn);
    }

    public static function updateUserLastLogin($user_id, $date){
      $connection = connect();

      $update_login_query = "UPDATE " . TBL_USER .
                  " SET LastLogin=:date ".
                  " WHERE ID=:user_id";

      try{
        $st = $connection->prepare($update_login_query);
        $st->bindValue(":date", $date, PDO::PARAM_STR);
        $st->bindValue(":user_id", $user_id, PDO::PARAM_INT);
        $st->execute();
        return $st->rowCount();
      }
      catch(PDOException $e){
        Util::quit("updateUserLastLogin", $e, $connection, false);
      }

      disconnect($connection);
    }
  }
 ?>
