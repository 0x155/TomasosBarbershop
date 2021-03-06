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
    This method gets rid of dashes, parentheses, and spaces in a given phone numer.
    This is done to the phone number entered by the user when searching
    for a customer by phone number. Phone numbers in the database are stored
    without these symbols.
    */
    public static function stripPhoneNumber($number){
      $phone_number_symbols = array("-", "(", ")", " ");
      return str_replace($phone_number_symbols, "", $number);
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
      if( (preg_match($phone_number_regex, $number)) && (strlen($number) == 10) ){
        $ret = true;
      }

      return $ret;
    }

    /*
    This function takes a phone number (home or cell) from the database,
    and parses it so the number is displayed with dashes
    6315893344 => 631-589-3344
    This makes it easier for the users to read the numbers
    */
    public static function formatPhoneNumber($number){
      $areaCode = substr($number, 0, 3);
      $next = substr($number, 3, 3);
      $rest = substr($number, 6);
      return $areaCode . "-" . $next . "-" . $rest;
    }


    public static function quit($functionName, $exception, $connection, $exit){
      error_log("Failure in ".$functionName."(): " . $exception->getMessage());
      disconnect($connection);
      if($exit){
        //Calling exit prints the message and then exits the current PHP script
        // TODO does this exit the current script, or the one which calls quit()?
        exit("<p class=\"ajax_error\">There was an error processing your request</p>");
      }
    }
  }
 ?>
