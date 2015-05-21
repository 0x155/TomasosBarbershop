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
-- Current Database: `tomasosbarbershop_test`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `tomasosbarbershop_test` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `tomasosbarbershop_test`;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointment` (
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
  CONSTRAINT `appointment_ibfk_3` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `appointment_ibfk_4` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=354 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (3,'2015-03-27',4,2,'09:00:00','09:30:00','LJ color'),(6,'2015-03-27',9,3,'12:00:00','12:30:00','Doug - haircut'),(7,'2015-03-28',3,4,'09:00:00','09:30:00','first with Melvin'),(8,'2015-03-28',12,4,'13:00:00','13:15:00',''),(9,'2015-03-28',10,5,'10:30:00','11:00:00',''),(11,'2015-03-28',5,5,'09:30:00','10:00:00',''),(12,'2015-03-29',5,5,'12:30:00','13:00:00',''),(13,'2015-03-30',5,5,'12:30:00','13:00:00',''),(19,'2015-04-06',7,1,'16:00:00','16:30:00',''),(20,'2015-04-07',4,2,'16:00:00','16:30:00','Color with LJ - 4/7/2015'),(21,'2015-04-07',18,5,'10:00:00','10:15:00','Mrs. Deluca - eyebrow wax with Jackie'),(23,'2015-04-06',10,3,'10:00:00','10:30:00',''),(24,'2015-04-07',10,3,'14:30:00','15:00:00',''),(25,'2015-04-06',9,4,'10:30:00','11:00:00',''),(26,'2015-04-06',9,4,'11:00:00','11:15:00',''),(29,'2015-04-06',5,1,'17:00:00','17:30:00',''),(30,'2015-04-06',12,2,'11:00:00','11:30:00','haircut with vinny chase - fade'),(31,'2015-04-06',16,1,'10:00:00','10:30:00',''),(32,'2015-04-06',16,2,'10:30:00','10:45:00',''),(33,'2015-04-06',14,4,'11:45:00','12:15:00',''),(34,'2015-04-06',13,4,'12:45:00','13:15:00',''),(35,'2015-04-08',13,4,'12:45:00','13:15:00','2nd haircut for connor'),(36,'2015-04-08',14,4,'12:45:00','13:15:00','Billy\'s second hair\'cut'),(38,'2015-04-07',7,2,'15:30:00','16:00:00','Straightening'),(39,'2015-04-06',11,5,'15:30:00','15:45:00',''),(42,'2015-04-06',11,5,'15:00:00','15:30:00',''),(43,'2015-04-10',11,5,'15:00:00','15:15:00',''),(44,'2015-04-07',4,2,'09:00:00','09:15:00',''),(46,'2015-04-07',18,5,'09:00:00','09:30:00',''),(47,'2015-04-07',16,1,'09:00:00','09:30:00',''),(50,'2015-04-07',8,1,'09:45:00','10:15:00',''),(72,'2015-04-08',8,3,'11:15:00','11:45:00',''),(77,'2015-04-07',8,1,'11:30:00','12:00:00',''),(78,'2015-04-07',16,3,'11:30:00','12:00:00',''),(82,'2015-04-07',12,1,'11:45:00','12:15:00',''),(83,'2015-04-09',12,1,'12:45:00','13:15:00',''),(84,'2015-04-09',12,1,'12:45:00','13:15:00',''),(86,'2015-04-07',11,5,'12:45:00','13:00:00',''),(89,'2015-04-07',5,1,'15:15:00','15:30:00',''),(90,'2015-04-08',5,1,'15:30:00','16:00:00','test with blank fields'),(91,'2015-04-08',10,3,'10:30:00','11:00:00',''),(92,'2015-04-10',12,1,'11:30:00','11:45:00',''),(93,'2015-04-08',4,2,'11:30:00','11:45:00',''),(94,'2015-04-08',4,2,'11:45:00','12:15:00',''),(95,'2015-04-08',17,4,'12:00:00','12:30:00',''),(96,'2015-04-08',3,4,'12:45:00','13:15:00',''),(97,'2015-04-08',18,5,'13:15:00','13:45:00',''),(98,'2015-04-09',18,5,'09:15:00','09:45:00','Original Linda DeLuca'),(100,'2015-04-09',8,3,'12:45:00','13:00:00',''),(101,'2015-04-09',15,1,'14:30:00','15:00:00',''),(102,'2015-04-09',10,1,'11:45:00','12:15:00',''),(103,'2015-04-10',3,4,'10:30:00','10:45:00',''),(105,'2015-04-10',3,4,'11:00:00','11:30:00',''),(106,'2015-04-10',3,1,'11:30:00','12:00:00',''),(107,'2015-04-10',7,1,'11:30:00','12:00:00',''),(108,'2015-04-10',7,1,'11:45:00','12:15:00',''),(109,'2015-04-10',8,3,'11:45:00','12:00:00',''),(110,'2015-04-10',4,2,'12:00:00','12:15:00',''),(111,'2015-04-10',12,3,'12:00:00','12:15:00',''),(112,'2015-04-10',17,3,'12:00:00','12:30:00',''),(113,'2015-04-10',11,5,'12:30:00','13:00:00',''),(114,'2015-04-10',11,2,'12:45:00','13:15:00',''),(117,'2015-04-10',9,4,'10:00:00','10:30:00',''),(118,'2015-04-10',10,4,'10:30:00','11:00:00',''),(127,'2015-04-10',11,3,'14:00:00','14:15:00','eyebrow wax'),(130,'2015-04-10',16,1,'11:30:00','12:00:00',''),(131,'2015-04-10',17,3,'13:00:00','13:30:00',''),(132,'2015-04-10',13,4,'10:00:00','10:30:00','haircut with c - o\'neil'),(133,'2015-04-10',5,1,'10:00:00','10:30:00','test'),(134,'2015-04-10',14,4,'10:45:00','11:15:00',''),(138,'2015-04-11',12,1,'12:30:00','12:45:00','haircut with Vince'),(140,'2015-04-11',7,1,'10:00:00','10:30:00','test'),(141,'2015-04-11',7,1,'00:30:00','01:00:00','beard trim\n'),(142,'2015-04-11',7,1,'12:30:00','13:00:00','beard trim after'),(146,'2015-04-13',7,1,'11:00:00','11:15:00',''),(149,'2015-04-13',5,1,'09:15:00','09:45:00',''),(150,'2015-04-13',5,1,'09:45:00','10:00:00','\n\n'),(151,'2015-04-13',13,1,'11:00:00','11:30:00',''),(152,'2015-04-13',13,1,'11:30:00','12:00:00',''),(153,'2015-04-13',10,4,'11:30:00','12:00:00',''),(154,'2015-04-13',3,2,'14:00:00','14:30:00',''),(156,'2015-04-13',15,4,'15:00:00','15:30:00',''),(157,'2015-04-13',14,4,'13:00:00','13:30:00',''),(158,'2015-04-13',12,1,'16:00:00','16:30:00',''),(161,'2015-04-13',8,2,'17:00:00','17:30:00',''),(162,'2015-04-13',9,4,'17:00:00','17:30:00',''),(163,'2015-04-13',16,3,'17:00:00','17:30:00',''),(164,'2015-04-13',3,2,'17:00:00','17:30:00',''),(165,'2015-04-13',21,2,'10:00:00','10:30:00','Jane Doe - haircut, color, eyebrow wax'),(166,'2015-04-13',20,1,'10:00:00','10:30:00','JB - haircut'),(167,'2015-04-13',14,4,'12:00:00','12:30:00','haircut and beard trim'),(168,'2015-04-13',10,4,'10:30:00','11:00:00',''),(169,'2015-04-13',15,4,'11:00:00','11:30:00',''),(170,'2015-04-13',17,2,'10:30:00','11:00:00',''),(171,'2015-04-13',17,2,'11:00:00','11:15:00',''),(172,'2015-04-13',5,2,'10:00:00','10:15:00',''),(173,'2015-04-15',9,4,'10:00:00','10:30:00',''),(176,'2015-04-15',7,1,'15:00:00','15:30:00',''),(178,'2015-04-16',7,1,'10:00:00','10:30:00',''),(179,'2015-04-16',8,2,'12:00:00','12:30:00',''),(180,'2015-04-16',5,2,'12:00:00','12:30:00',''),(181,'2015-04-16',12,4,'12:00:00','12:30:00',''),(182,'2015-04-16',14,3,'12:00:00','12:30:00',''),(183,'2015-04-16',4,2,'12:00:00','12:30:00',''),(184,'2015-04-16',17,4,'12:00:00','12:30:00',''),(185,'2015-04-16',8,1,'13:00:00','13:30:00',''),(186,'2015-04-16',12,4,'13:00:00','13:30:00',''),(187,'2015-04-16',8,4,'14:00:00','14:30:00','Test with multiple services - Dylan'),(188,'2015-04-16',7,1,'14:00:00','14:30:00','one service - haircut christian'),(190,'2015-04-16',13,1,'14:00:00','14:30:00',''),(191,'2015-04-16',6,2,'14:00:00','14:30:00',''),(192,'2015-04-16',8,3,'14:00:00','14:30:00',''),(194,'2015-04-16',10,3,'11:00:00','11:30:00',''),(195,'2015-04-16',9,2,'11:00:00','11:30:00',''),(197,'2015-04-17',6,2,'10:00:00','10:30:00',''),(198,'2015-04-16',3,1,'15:00:00','15:30:00',''),(200,'2015-04-16',16,4,'15:00:00','15:30:00',''),(201,'2015-04-17',7,1,'16:00:00','16:30:00',''),(202,'2015-04-16',20,1,'10:00:00','10:30:00',''),(203,'2015-04-16',5,1,'11:30:00','12:00:00',''),(204,'2015-04-16',4,2,'11:00:00','11:30:00',''),(205,'2015-04-16',21,5,'10:00:00','10:30:00',''),(206,'2015-04-16',17,1,'10:00:00','10:30:00',''),(207,'2015-04-20',21,2,'09:00:00','09:30:00','Jane Doe - eyebrow wax and color'),(209,'2015-04-20',17,4,'09:30:00','10:00:00','Joe D - haircut, unavailable, and beard trim'),(211,'2015-04-20',3,4,'09:30:00','10:00:00','swanson - haircut and beard trim'),(214,'2015-04-20',15,4,'11:00:00','11:30:00','dukes - haircut and beard trim'),(215,'2015-04-20',5,1,'11:00:00','11:30:00','Ari - haircut and beard trim'),(216,'2015-04-21',17,1,'14:00:00','14:30:00','Joe D - haircut, 2pm start, 1hr 45 mins'),(217,'2015-04-21',4,2,'14:00:00','14:30:00','Mom - color, 2pm start, 45 mins'),(218,'2015-04-21',12,4,'14:30:00','15:00:00','vinny, haircut and beard trim, 2:30pm start, 2.5 hrs'),(219,'2015-04-21',6,5,'15:00:00','15:30:00','B. Jones, 3pm start, 2 hrs 30 mins'),(220,'2015-04-21',5,1,'15:45:00','16:15:00',''),(221,'2015-04-21',20,1,'13:30:00','14:00:00',''),(222,'2015-04-21',8,4,'13:30:00','14:00:00',''),(223,'2015-04-21',7,1,'13:30:00','14:00:00',''),(224,'2015-04-21',18,5,'09:30:00','10:00:00',''),(225,'2015-04-21',21,5,'08:00:00','08:30:00',''),(226,'2015-04-21',15,1,'11:30:00','12:00:00',''),(227,'2015-04-21',4,2,'10:30:00','11:30:00','mom - color, 1 hour'),(228,'2015-04-21',3,3,'11:30:00','13:00:00',''),(229,'2015-04-21',16,1,'10:30:00','11:00:00',''),(231,'2015-04-21',18,5,'12:00:00','13:30:00',''),(232,'2015-04-21',6,1,'10:30:00','12:00:00','Two kids'),(233,'2015-04-22',5,1,'09:30:00','10:45:00','haircut, shave, color'),(234,'2015-04-22',20,2,'11:30:00','12:30:00',''),(235,'2015-04-22',17,2,'11:30:00','12:30:00',''),(236,'2015-04-22',4,5,'09:15:00','10:30:00',''),(237,'2015-04-22',16,4,'09:30:00','10:45:00',''),(238,'2015-04-22',11,2,'11:45:00','13:00:00',''),(239,'2015-04-22',13,1,'10:30:00','11:15:00',''),(241,'2015-04-22',25,2,'11:15:00','12:45:00',''),(242,'2015-04-22',22,4,'11:30:00','12:15:00',''),(244,'2015-04-22',6,2,'15:30:00','17:30:00','haircut for three sons'),(245,'2015-04-22',10,3,'11:30:00','12:15:00',''),(246,'2015-04-23',20,1,'11:30:00','12:15:00','haircut and beard trim - Jon'),(249,'2015-04-24',26,3,'12:15:00','13:00:00',''),(250,'2015-04-24',8,3,'11:00:00','11:45:00',''),(259,'2015-04-28',24,1,'11:00:00','11:30:00',''),(265,'2015-04-28',20,2,'09:30:00','10:15:00',''),(276,'2015-04-28',NULL,1,'11:00:00','13:00:00',''),(277,'2015-04-28',NULL,2,'09:00:00','15:00:00',''),(278,'2015-04-28',NULL,3,'09:00:00','19:30:00',''),(279,'2015-04-28',7,4,'11:30:00','12:15:00',''),(280,'2015-04-28',NULL,4,'10:00:00','11:30:00',''),(281,'2015-04-28',6,5,'10:00:00','11:00:00',''),(282,'2015-04-28',NULL,5,'11:00:00','12:30:00',''),(283,'2015-04-28',8,5,'12:30:00','13:00:00',''),(284,'2015-04-28',5,2,'15:00:00','15:45:00',''),(286,'2015-04-28',4,2,'15:00:00','16:00:00',''),(287,'2015-04-30',4,5,'15:15:00','16:00:00',''),(288,'2015-05-01',8,4,'15:15:00','16:00:00',''),(290,'2015-04-30',NULL,1,'09:30:00','10:15:00',''),(291,'2015-05-02',NULL,1,'09:30:00','09:45:00',''),(293,'2015-04-30',16,4,'13:00:00','13:30:00',''),(296,'2015-04-30',33,1,'11:00:00','11:30:00',''),(297,'2015-04-30',7,1,'11:00:00','11:30:00',''),(298,'2015-04-30',20,3,'11:00:00','11:30:00',''),(299,'2015-04-30',8,3,'11:00:00','11:30:00',''),(301,'2015-04-30',18,5,'11:00:00','11:30:00',''),(302,'2015-04-30',4,5,'11:00:00','11:30:00',''),(303,'2015-04-30',12,1,'12:00:00','12:30:00',''),(304,'2015-04-30',24,4,'10:00:00','10:45:00',''),(305,'2015-04-30',22,4,'10:00:00','10:30:00',''),(306,'2015-04-30',8,2,'10:00:00','10:30:00',''),(308,'2015-04-30',18,2,'10:00:00','10:30:00',''),(309,'2015-04-30',6,2,'10:00:00','10:30:00',''),(311,'2015-04-30',6,2,'10:00:00','10:30:00',''),(312,'2015-04-30',21,2,'10:30:00','11:00:00',''),(313,'2015-04-30',18,2,'10:30:00','11:00:00',''),(314,'2015-04-30',4,2,'10:30:00','11:00:00',''),(315,'2015-04-24',7,2,'09:30:00','10:00:00',''),(316,'2015-04-24',20,3,'10:30:00','11:00:00',''),(317,'2015-04-24',21,2,'15:00:00','15:30:00',''),(318,'2015-04-30',11,2,'10:30:00','11:00:00',''),(320,'2015-04-30',9,2,'12:00:00','12:45:00',''),(321,'2015-04-30',14,1,'10:15:00','10:45:00',''),(322,'2015-04-30',13,1,'10:15:00','10:45:00',''),(323,'2015-04-30',12,1,'10:15:00','10:45:00',''),(324,'2015-05-01',14,1,'10:30:00','11:00:00',''),(325,'2015-05-01',13,1,'10:30:00','11:00:00',''),(326,'2015-04-30',4,2,'19:00:00','19:30:00',''),(327,'2015-04-30',8,2,'19:00:00','19:30:00',''),(328,'2015-04-30',15,3,'19:00:00','19:30:00',''),(329,'2015-05-01',5,NULL,'10:30:00','11:00:00','test with CB 1'),(330,'2015-05-01',12,1,'10:30:00','11:00:00',''),(331,'2015-05-01',21,NULL,'10:30:00','11:00:00',''),(332,'2015-05-01',13,1,'09:30:00','10:00:00',''),(333,'2015-05-01',21,2,'09:30:00','10:30:00',''),(334,'2015-05-01',16,3,'09:30:00','10:15:00',''),(335,'2015-05-01',15,4,'09:30:00','10:00:00',''),(336,'2015-05-01',4,5,'09:30:00','09:45:00',''),(337,'2015-05-04',6,5,'10:00:00','10:30:00',''),(338,'2015-05-07',20,3,'10:00:00','10:30:00','Test haircut with JB'),(339,'2015-05-07',20,3,'10:00:00','10:30:00','Test with JB'),(341,'2015-05-14',46,2,'10:00:00','10:45:00','test with zuc'),(347,'2015-05-14',33,3,'10:30:00','11:15:00',''),(348,'2015-05-15',NULL,2,'09:00:00','19:30:00',''),(349,'2015-05-14',NULL,4,'09:00:00','12:30:00',''),(350,'2015-05-14',52,3,'10:30:00','11:30:00',''),(351,'2015-05-14',40,3,'11:45:00','12:30:00',''),(352,'2015-05-28',20,2,'11:00:00','11:45:00','Haircut and trim with Jon'),(353,'2015-06-05',20,2,'11:00:00','12:00:00','');
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment2`
--

DROP TABLE IF EXISTS `appointment2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointment2` (
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
  KEY `CustomerID` (`CustomerID`),
  KEY `EmployeeID` (`EmployeeID`),
  KEY `Unit_ID` (`Unit_ID`),
  CONSTRAINT `appointment2_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`),
  CONSTRAINT `appointment2_ibfk_2` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`ID`),
  CONSTRAINT `appointment2_ibfk_3` FOREIGN KEY (`Unit_ID`) REFERENCES `employee` (`Unit_ID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment2`
--

LOCK TABLES `appointment2` WRITE;
/*!40000 ALTER TABLE `appointment2` DISABLE KEYS */;
INSERT INTO `appointment2` VALUES (1,'2015-05-04 10:00:00','2015-05-04 10:30:00','Haircut -- Christian Bonacore',1,7,'Test haircut with CB','#3A87AD',1),(2,'2015-05-04 13:00:00','2015-05-04 13:30:00','Haircut -- Dylan Bonacore',1,8,'Test haircut with Dylan','#3A87AD',1),(3,'2015-05-04 11:00:00','2015-05-04 11:30:00','Color -- Laura-Jean Bonacore',2,4,'Test color with mom','#3A87AD',2),(4,'2015-05-04 12:00:00','2015-05-04 13:00:00','Haircut -- Ari Gold',2,5,'Test haircut with AG - 1111','#3A87AD',2),(6,'2015-05-05 11:00:00','2015-05-05 13:00:00','Haircut -- Vince Chase',1,12,'Kieron - haircut w/ Vince chase','#3A87AD',1),(9,'2015-05-18 11:00:00','2015-05-18 12:00:00','Test haircut',3,20,'test haircut with Jonathan - do a fade','#3A87AD',3),(10,'2015-05-18 10:00:00','2015-05-18 11:15:00','Haircut --- Dylan Bonacore',1,8,'---Dylan haircut with Kieron----','#3A87AD',1),(11,'2015-05-19 11:30:00','2015-05-19 12:15:00','Haircut, Beard Trim --- Dylan Bonacore',2,8,'--Haircut and beard trim with Dylan','#3A87AD',2),(12,'2015-05-18 09:30:00','2015-05-18 10:30:00','Color, Eyebrow Wax --- Laura',2,4,'Color and eyebrow wax - Mom','#3A87AD',2),(13,'2015-05-18 15:00:00','2015-05-18 15:45:00','Haircut --- Chris Deluca',4,15,'--Dukes haircut with Melvin','#3A87AD',4),(25,'2015-05-19 13:00:00','2015-05-19 13:45:00','Haircut, Beard Trim --- Christian Bonacore',1,7,'CB haircut and trim','#3A87AD',1),(26,'2015-05-19 09:00:00','2015-05-19 19:30:00','Unavailable --- Jackie',5,7,'','#3A87AD',5),(36,'2015-05-20 19:30:00','2015-05-20 21:00:00','Haircut --- John McNicholas',2,7,'appt\'s end time is past business hrs.','#3A87AD',2),(46,'2015-05-20 10:45:00','2015-05-20 11:15:00','Haircut --- Jonathan Bonacore',1,4,'','#3A87AD',1),(47,'2015-05-20 13:00:00','2015-05-20 14:15:00','Color, Eyebrow Wax --- Jane Doe',2,4,'','#FF887C',2),(49,'2015-05-20 10:30:00','2015-05-20 11:00:00','Haircut --- lu',4,4,'','#368C23',4),(50,'2015-05-20 11:30:00','2015-05-20 13:00:00','Color --- Laura-Jean Bonacore',5,4,'','#C353E8',5),(52,'2015-05-20 10:30:00','2015-05-20 11:00:00','Haircut --- John Messina',2,4,'---Test comment---','#FF887C',2),(56,'2015-05-20 11:00:00','2015-05-20 11:30:00','Haircut --- Robbie Messina',3,24,'','#F58839',3);
/*!40000 ALTER TABLE `appointment2` ENABLE KEYS */;
UNLOCK TABLES;

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
  KEY `Service_Name` (`Service_Name`),
  KEY `Appt_ID` (`Appt_ID`),
  CONSTRAINT `appointment_service_ibfk_2` FOREIGN KEY (`Service_Name`) REFERENCES `service` (`Name`),
  CONSTRAINT `appointment_service_ibfk_3` FOREIGN KEY (`Appt_ID`) REFERENCES `appointment` (`Appt_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=232 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment_service`
--

LOCK TABLES `appointment_service` WRITE;
/*!40000 ALTER TABLE `appointment_service` DISABLE KEYS */;
INSERT INTO `appointment_service` VALUES (1,187,'Haircut'),(2,187,'Beard Trim'),(3,187,'Shave'),(4,188,'Haircut'),(6,190,'Haircut'),(7,190,'Beard Trim'),(8,191,'Color'),(9,192,'Haircut'),(10,192,'Beard Trim'),(11,192,'Shave'),(13,194,'Haircut'),(14,195,'Haircut'),(15,195,'Unavailable'),(16,195,'Beard Trim'),(18,197,'Color'),(19,197,'Eyebrow Wax'),(20,198,'Haircut'),(21,198,'Beard Trim'),(22,198,'Shave'),(24,200,'Haircut'),(25,200,'Shave'),(26,201,'Haircut'),(27,201,'Beard Trim'),(28,202,'Haircut'),(29,202,'Beard Trim'),(30,203,'Haircut'),(31,203,'Color'),(32,204,'Color'),(33,204,'Eyebrow Wax'),(34,205,'Color'),(35,205,'Eyebrow Wax'),(36,206,'Haircut'),(37,207,'Color'),(38,207,'Eyebrow Wax'),(41,209,'Haircut'),(43,209,'Beard Trim'),(45,211,'Haircut'),(46,211,'Beard Trim'),(49,214,'Haircut'),(50,214,'Beard Trim'),(51,215,'Haircut'),(52,215,'Beard Trim'),(53,216,'Haircut'),(54,217,'Color'),(55,218,'Haircut'),(56,218,'Beard Trim'),(57,219,'Color'),(58,220,'Haircut'),(59,221,'Haircut'),(60,222,'Haircut'),(61,223,'Haircut'),(62,223,'Shave'),(63,224,'Color'),(64,225,'Color'),(65,226,'Haircut'),(66,226,'Shave'),(67,227,'Color'),(68,228,'Haircut'),(69,228,'Shave'),(70,228,'Color'),(71,229,'Haircut'),(74,231,'Color'),(75,231,'Eyebrow Wax'),(76,232,'Haircut'),(77,233,'Haircut'),(78,233,'Shave'),(79,233,'Color'),(80,234,'Haircut'),(81,234,'Beard Trim'),(82,235,'Haircut'),(83,235,'Shave'),(84,236,'Color'),(85,236,'Eyebrow Wax'),(86,237,'Haircut'),(87,237,'Color'),(88,238,'Color'),(89,238,'Eyebrow Wax'),(90,239,'Haircut'),(91,239,'Beard Trim'),(94,241,'Color'),(95,241,'Eyebrow Wax'),(96,242,'Haircut'),(97,242,'Shave'),(99,244,'Haircut'),(100,245,'Haircut'),(101,245,'Beard Trim'),(102,246,'Haircut'),(103,246,'Shave'),(104,246,'Beard Trim'),(108,249,'Haircut'),(109,249,'Beard Trim'),(110,250,'Haircut'),(111,250,'Beard Trim'),(120,259,'Haircut'),(127,265,'Haircut'),(128,265,'Beard Trim'),(139,276,'Unavailable'),(140,277,'Unavailable'),(141,278,'Unavailable'),(142,279,'Haircut'),(143,279,'Beard Trim'),(144,280,'Unavailable'),(145,281,'Color'),(146,281,'Eyebrow Wax'),(147,282,'Unavailable'),(148,283,'Haircut'),(149,284,'Haircut'),(151,286,'Color'),(152,287,'Color'),(153,288,'Haircut'),(155,290,'Haircut'),(156,290,'Beard Trim'),(157,291,'Shave'),(160,293,'Haircut'),(163,296,'Haircut'),(164,297,'Haircut'),(165,298,'Haircut'),(166,299,'Haircut'),(168,301,'Color'),(169,302,'Color'),(170,303,'Haircut'),(171,304,'Haircut'),(172,305,'Haircut'),(173,306,'Haircut'),(175,308,'Color'),(176,309,'Color'),(178,311,'Color'),(179,312,'Eyebrow Wax'),(180,312,'Color'),(181,313,'Color'),(182,314,'Color'),(183,315,'Haircut'),(184,316,'Shave'),(185,317,'Color'),(186,318,'Color'),(188,320,'Haircut'),(189,321,'Haircut'),(190,322,'Haircut'),(191,323,'Haircut'),(192,324,'Haircut'),(193,325,'Haircut'),(194,326,'Color'),(195,327,'Haircut'),(196,328,'Haircut'),(197,329,'Haircut'),(198,330,'Haircut'),(199,331,'Color'),(200,332,'Haircut'),(201,333,'Color'),(202,333,'Eyebrow Wax'),(203,334,'Haircut'),(204,334,'Shave'),(205,335,'Haircut'),(206,336,'Eyebrow Wax'),(207,337,'Color'),(208,338,'Haircut'),(209,339,'Haircut'),(212,341,'Haircut'),(213,341,'Beard Trim'),(220,347,'Haircut'),(221,347,'Beard Trim'),(222,348,'Unavailable'),(223,349,'Unavailable'),(224,350,'Haircut'),(225,350,'Beard Trim'),(226,351,'Haircut'),(227,351,'Shave'),(228,352,'Haircut'),(229,352,'Beard Trim'),(230,353,'Haircut'),(231,353,'Color');
/*!40000 ALTER TABLE `appointment_service` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `child`
--

LOCK TABLES `child` WRITE;
/*!40000 ALTER TABLE `child` DISABLE KEYS */;
INSERT INTO `child` VALUES (6,7),(7,8),(8,9),(9,10),(11,15),(12,16),(13,17),(10,20),(14,22),(15,23),(16,24);
/*!40000 ALTER TABLE `child` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (3,'Joe Swanson','M','631-111-2222','','swansonj@hotmail.com','','1989-09-08','','T','T'),(4,'Laura-Jean Bonacore','F','516-333-7910','','ljrunner@yahoo.com','','1964-08-31','Likes to run','T','F'),(5,'Ari Gold','M','631-777-8888','','golda@gmail.com','','1969-09-08','','F','T'),(6,'Barbara Jones','F','631-123-4567','631-567-1111','','51 Budenos Dr, Sayville, NY, 11782','1960-12-18','','F','T'),(7,'Christian Bonacore','M','631-433-2215','631-589-6415','cbonaco1@binghamton.edu','2 Sampson Street, Sayville, NY 11782','1989-09-08','Developer of web site','T','T'),(8,'Dylan Bonacore','M','631-908-1514','','dbonacore@gmail.com','','1994-12-08','','T','F'),(9,'Joseph Jones','M','631-111-4567','','jonesj@highschool.com','51 Budenos Dr, Sayville, NY, 11782','1992-11-11','Son of Barbara','T','F'),(10,'Mike Jones','M','631-111-4568','','jonesm@highschool.com','','1990-10-11','Other son of Barbara','T','T'),(11,'Mary Smith','F','631-333-2222','','smithm@hotmail.com','55 Kemi Lane, Sayville, NY, 11782','1969-03-11','Just one female customer','T','T'),(12,'Vince Chase','M','631-111-4444','631-589-8899','chasev@yahoo.com','','1989-10-03','just one male customer','T','T'),(13,'Connor O\'Neil','M','631-555-1439','','coneil@marist.edu','Colton Ave, Sayville, NY 11782','1994-12-03','Dylan\'s friend','T','T'),(14,'Billy O\'Connor','M','631-906-4431','','boc47@aim.com','','1989-11-11','','T','T'),(15,'Chris Deluca','M','631-666-5885','','dukes32@gmail.com','32 Colton Ave, Sayville, NY 11782','1989-05-15','','T','T'),(16,'John Deluca','M','631-666-5887','','johnny@gotm.com','32 Colton Ave, Sayville, NY 11782','1987-06-10','','T','T'),(17,'Joe Deluca','M','631-666-5889','','joe@cortland.edu','32 Colton Ave, Sayville, NY 11782','1992-05-15','','T','T'),(18,'Linda Deluca','F','631-666-5891','','mrs.deluca@gmail.com','32 Colton Ave, Sayville, NY 11782','1964-05-15','','T','T'),(19,'Linda Deluca','F','631-111-2222','','mrs.deluca_no2@gmail.com','212 1st Ave, Islip, NY 11782','1964-09-08','Duplicate Linda Deluca','T','T'),(20,'Jonathan Bonacore','M','631-901-1415','','jonbon5@gmail.com','222 St, San Francisco, CA','1991-09-21','','T','T'),(21,'Jane Doe','F','631-911-1111','','','222 1st Ave, NY, NY','1987-10-10','','T','T'),(22,'Matt Messina','M','631-333-4444','','matt.messina@gmail.com','321 Sayville Blvd, Sayville, NY','1987-02-10','','T','T'),(23,'Mike Messina','M','631-521-4114','','mike.messina@gmail.com','321 Sayville Blvd, Sayville, NY','1989-02-15','','T','T'),(24,'Robbie Messina','M','631-567-4444','','bobo.messina@gmail.com','321 Sayville Blvd, Sayville, NY','1991-02-10','','T','T'),(25,'Erin Messina','F','631-511-2233','','','321 Sayville Blvd, Sayville, NY',NULL,'','T','T'),(26,'John Messina','M','631-567-4444','','john.messina@gmail.com','321 Sayville Blvd, Sayville, NY',NULL,'','T','T'),(33,'John McNicholas','M',NULL,NULL,'johnmac31793@aim.com','49 Raymond St',NULL,NULL,NULL,NULL),(34,'R. Vinicombe',NULL,NULL,NULL,NULL,'51 Craig Rd, Islip Terrace',NULL,NULL,NULL,NULL),(35,'Brendan Ward','M',NULL,NULL,'bwardns26@aol.com',NULL,NULL,NULL,NULL,NULL),(36,'Nick Nigio','M',NULL,NULL,'nigroll6@gmail.com','123 Sherry St, East Islip',NULL,NULL,NULL,NULL),(37,'Alex Baier','M',NULL,NULL,'aj6yankee@aol.com','7 Dock Rd, East Islip',NULL,NULL,NULL,NULL),(38,'James Caporsco','M',NULL,NULL,'capbatmd@netscape.net','114 Michael Rd, Oakdale, NY',NULL,NULL,NULL,NULL),(39,'Jee Bisch',NULL,NULL,NULL,'jimbisch@gmail.com',NULL,NULL,NULL,NULL,NULL),(40,'Joel Perez','M',NULL,NULL,'bboyjoeziz@yahoo.com','28 Keswick Dr, East Islip, NY',NULL,NULL,NULL,NULL),(41,'Joe Macedo','M',NULL,NULL,'joeseph.macedo@gmail.com','1836 Westlawn Drive',NULL,NULL,NULL,NULL),(42,'Luis Aceund','M',NULL,NULL,NULL,'454 Main St Apt D, Islip, NY',NULL,NULL,NULL,NULL),(43,'Keith Byrnes','M',NULL,NULL,'akburnz@optonline.net','39 Patchouge Ave, East Islip, NY',NULL,NULL,NULL,NULL),(44,'Kevin Togher','M',NULL,NULL,'ktogher@gmail.com','28 Tellar Dr., Islip Terrace, NY, 11752',NULL,NULL,NULL,NULL),(45,'Mohammad Zahid','M',NULL,NULL,'m2futuremj@aim.com','229 Bryant St, Islip Terrace, NY',NULL,NULL,NULL,NULL),(46,'Michael Zicocecca','M',NULL,NULL,'miczic@verizon.net','41 Rosemary Drive, East Islip, NY',NULL,NULL,NULL,NULL),(47,'Bryan Brown','M',NULL,NULL,'bbrown3230@yahoo.com','23 Argyle Dr, East Islip, NY',NULL,NULL,NULL,NULL),(48,'Nick Mucchio','M',NULL,NULL,'zeikda@optonline.net','68 Arline Lane, East Islip NY',NULL,NULL,NULL,NULL),(49,'Reena Foundas','F',NULL,NULL,'r.foundas@yahoo.com','27 Freeport St, East Islip, NY',NULL,NULL,NULL,NULL),(50,'Chip Cipriano','M',NULL,NULL,'cips50@yahoo.com','253 Wilson Blvd, Islip, NY',NULL,NULL,NULL,NULL),(51,'Frank Esposito','M',NULL,NULL,'fwespo1986@yahoo.com','14 Esplande Dr, E. Patchouge NY',NULL,NULL,NULL,NULL),(52,'Michael McNulty','M',NULL,NULL,'eichiefs39@yahoo.com','228 Marilynn St, East Islip, NY, 11730',NULL,NULL,NULL,NULL),(53,'Juan Bautista','M',NULL,NULL,'juandnungia@hotmail.com','3151 Union Blvd, East Islip, NY',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'Kieron','631-123-4567','','tomasok@gmail.com',1),(2,'Tiara','631-444-5566','631-111-2222','sunnytomaso@gmail.com',2),(3,'Doug','631-555-8888','631-867-5309','doug@gmail.com',3),(4,'Melvin','631-111-2222','','melvin@hotmail.com',4),(5,'Jackie','631-111-4444','631-000-1111','jackie@gmail.com',5);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `parent`
--

LOCK TABLES `parent` WRITE;
/*!40000 ALTER TABLE `parent` DISABLE KEYS */;
INSERT INTO `parent` VALUES (1,4),(2,6),(3,18),(4,25),(5,26),(10,33);
/*!40000 ALTER TABLE `parent` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `parent_child`
--

LOCK TABLES `parent_child` WRITE;
/*!40000 ALTER TABLE `parent_child` DISABLE KEYS */;
INSERT INTO `parent_child` VALUES (1,6),(1,7),(1,10),(2,8),(2,9),(3,11),(3,12),(3,13),(4,14),(4,15),(4,16),(5,14),(5,15),(5,16);
/*!40000 ALTER TABLE `parent_child` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES ('Beard Trim'),('Color'),('Eyebrow Wax'),('Haircut'),('Shave'),('Unavailable');
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-05-21 12:27:18
