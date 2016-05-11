<?php
  //This class stores functions that are used throughout the app (not specific to Customers, Appointments, etc.)
  require_once("common.php");
  
  class Util {
    /*
    This function is used when getting full customer visit history.
    It parses the text field of an appointment - "Haircut -- Christian Bonacore"
    for example, to get the list of services for an appointment.
    Note the argument to explode is very critical. If for whatever reason the
    Appointment.Text field changes, the argument will need to change.
    */
    public static function parseService($servicesIn){
      $parsed = explode(" --- ", $servicesIn);
      return current($parsed);
    }

    /*
    Returns true or false if a number is a valid phone number
    based on regex, and length of the string
    */
    public static function validatePhoneNumber($number){
      //Remove dashes, open and closed parentheses, and spaces from the phone number
      $phone_number_symbols = array("-", "(", ")", " ");
      $number = str_replace($phone_number_symbols, "", $number);
      $phone_number_regex = "/[0-9]/";
      $ret = false;

      //If the $number string is empty, return true
      if(empty($number)){
        $ret = true;
      }

      //Phone number is valid if it contains all digits, and is of either length 7 or 10
      if( (preg_match($phone_number_regex, $number)) &&  ((strlen($number) == 7) || (strlen($number) == 10))   ){
        $ret = true;
      }

      return $ret;
    }


    public static function quit($functionName, $exception, $connection, $exit){
      error_log("Failure in ".$functionName."(): " . $exception->getMessage());
      disconnect($connection);
      if($exit){
        //Calling exit prints the message and then exits the current PHP script
        exit("<p class=\"ajax_error\">There was an error processing your request</p>");
      }
    }
  }
 ?>
