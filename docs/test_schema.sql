-- MySQL dump 10.13  Distrib 5.6.21, for Win32 (x86)
--
-- Host: localhost    Database: tomasosbarbershop_test
-- ------------------------------------------------------
-- Server version	5.6.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointment` (
  `id` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `text` varchar(256) DEFAULT NULL,
  `EmployeeID` smallint(50) unsigned DEFAULT NULL,
  `CustomerID` int(25) unsigned DEFAULT NULL,
  `Notes` varchar(256) DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  `Unit_ID` smallint(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `EmployeeID` (`EmployeeID`),
  KEY `Unit_ID` (`Unit_ID`),
  KEY `CustomerID` (`CustomerID`),
  CONSTRAINT `appointment_ibfk_4` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `appointment_ibfk_5` FOREIGN KEY (`Unit_ID`) REFERENCES `employee` (`Unit_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `appointment_ibfk_6` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=585 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `appointment_orig`
--

DROP TABLE IF EXISTS `appointment_orig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointment_orig` (
  `Appt_ID` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `Appt_Date` date DEFAULT NULL,
  `CustomerID` int(25) unsigned DEFAULT NULL,
  `EmployeeID` smallint(50) unsigned DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Notes` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`Appt_ID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `EmployeeID` (`EmployeeID`),
  CONSTRAINT `appointment_orig_ibfk_3` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `appointment_orig_ibfk_4` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=354 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `appointment_service`
--

DROP TABLE IF EXISTS `appointment_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointment_service` (
  `ID` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `Appt_ID` int(25) unsigned DEFAULT NULL,
  `Service_Name` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `Appt_ID` (`Appt_ID`),
  KEY `Service_Name` (`Service_Name`),
  CONSTRAINT `appointment_service_ibfk_1` FOREIGN KEY (`Appt_ID`) REFERENCES `appointment` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointment_service_ibfk_2` FOREIGN KEY (`Service_Name`) REFERENCES `service` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=652 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `appointment_service_orig`
--

DROP TABLE IF EXISTS `appointment_service_orig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointment_service_orig` (
  `ID` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `Appt_ID` int(25) unsigned DEFAULT NULL,
  `Service_Name` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `Service_Name` (`Service_Name`),
  KEY `Appt_ID` (`Appt_ID`),
  CONSTRAINT `appointment_service_orig_ibfk_2` FOREIGN KEY (`Service_Name`) REFERENCES `service` (`Name`),
  CONSTRAINT `appointment_service_orig_ibfk_3` FOREIGN KEY (`Appt_ID`) REFERENCES `appointment_orig` (`Appt_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=232 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `child`
--

DROP TABLE IF EXISTS `child`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `child` (
  `Child_ID` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `CustomerID` int(25) unsigned DEFAULT NULL,
  PRIMARY KEY (`Child_ID`),
  KEY `CustomerID` (`CustomerID`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `ID` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(256) DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `CellPhoneNumber` varchar(20) DEFAULT NULL,
  `HomePhoneNumber` varchar(20) DEFAULT NULL,
  `EmailAddress` varchar(256) DEFAULT NULL,
  `HomeAddress` varchar(512) DEFAULT NULL,
  `Birthday` date DEFAULT NULL,
  `Notes` varchar(512) DEFAULT NULL,
  `AllowText` varchar(5) DEFAULT NULL,
  `AllowEmail` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `unique_customer_name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=506 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee` (
  `ID` smallint(50) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(256) NOT NULL,
  `CellPhoneNumber` varchar(50) NOT NULL,
  `HomePhoneNumber` varchar(50) NOT NULL,
  `EmailAddress` varchar(256) NOT NULL,
  `Unit_ID` smallint(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Unit_ID` (`Unit_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parent`
--

DROP TABLE IF EXISTS `parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parent` (
  `Parent_ID` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `CustomerID` int(25) unsigned DEFAULT NULL,
  PRIMARY KEY (`Parent_ID`),
  KEY `CustomerID` (`CustomerID`),
  CONSTRAINT `parent_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parent_child`
--

DROP TABLE IF EXISTS `parent_child`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parent_child` (
  `Parent_ID` int(25) unsigned NOT NULL,
  `Child_ID` int(25) unsigned NOT NULL,
  KEY `Parent_ID` (`Parent_ID`),
  KEY `Child_ID` (`Child_ID`),
  CONSTRAINT `parent_child_ibfk_3` FOREIGN KEY (`Parent_ID`) REFERENCES `parent` (`Parent_ID`) ON DELETE CASCADE,
  CONSTRAINT `parent_child_ibfk_4` FOREIGN KEY (`Child_ID`) REFERENCES `child` (`Child_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service` (
  `Name` varchar(256) NOT NULL,
  PRIMARY KEY (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `ID` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `Username` varchar(256) NOT NULL,
  `Password` varchar(256) NOT NULL,
  `LastLogin` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-20 15:33:36
