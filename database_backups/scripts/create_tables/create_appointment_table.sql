CREATE TABLE IF NOT EXISTS Appointment (
	Appt_ID INT(25) UNSIGNED NOT NULL AUTO_INCREMENT,
	Appt_Date DATE,
	CustomerID INT(25) UNSIGNED,
	EmployeeID SMALLINT(50) UNSIGNED,
	StartTime TIME,
	EndTime TIME,
	ServiceName VARCHAR(256),
	Notes VARCHAR(256),
	FOREIGN KEY (CustomerID) REFERENCES Customer(ID),
	FOREIGN KEY (EmployeeID) REFERENCES Employee(ID),
	FOREIGN KEY (ServiceName) REFERENCES Service(Name),
	PRIMARY KEY (Appt_ID)
);

/* This table is just used for testing purposes to load data from the database into the scheduler */
CREATE TABLE Appointment2 (
	Appt_ID INT(25) UNSIGNED NOT NULL AUTO_INCREMENT,
	Appt_Start DATETIME,
	Appt_End DATETIME,
	Title VARCHAR(256),
	EmployeeID SMALLINT(50) UNSIGNED,
	CustomerID INT(25) UNSIGNED,
	Notes VARCHAR(256),
	FOREIGN KEY (CustomerID) REFERENCES Customer(ID),
	FOREIGN KEY (EmployeeID) REFERENCES Employee(ID),
	PRIMARY KEY (Appt_ID)
);

ALTER TABLE Appointment2 CHANGE Appt_Start start_date DATETIME;
ALTER TABLE Appointment2 CHANGE Appt_End end_date DATETIME;
ALTER TABLE Appointment2 CHANGE Title text VARCHAR(256);
ALTER TABLE Appointment2 CHANGE Appt_ID id INT(25) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE Appointment2 ADD COLUMN color VARCHAR(7);
UPDATE Appointment2 SET color="#3A87AD" WHERE color is null;

INSERT INTO Appointment2 (Appt_Start, Appt_End, Title, EmployeeID, CustomerID, Notes) VALUES ("2015-05-04 10:00:00", "2015-05-04 10:30:00", "Haircut -- Christian Bonacore", 1, 7, "Test haircut with CB");
INSERT INTO Appointment2 (Appt_Start, Appt_End, Title, EmployeeID, CustomerID, Notes) VALUES ("2015-05-04 13:00:00", "2015-05-04 13:30:00", "Haircut -- Dylan Bonacore", 1, 8, "Test haircut with Dylan");
INSERT INTO Appointment2 (Appt_Start, Appt_End, Title, EmployeeID, CustomerID, Notes) VALUES ("2015-05-04 11:00:00", "2015-05-04 11:30:00", "Color -- Laura-Jean Bonacore", 2, 4, "Test color with mom");
INSERT INTO Appointment2 (Appt_Start, Appt_End, Title, EmployeeID, CustomerID, Notes) VALUES ("2015-05-04 12:00:00", "2015-05-04 12:30:00", "Haircut -- Ari Gold", 2, 5, "Test haircut with AG");
INSERT INTO Appointment2 (Appt_Start, Appt_End, Title, EmployeeID, CustomerID, Notes) VALUES ("2015-05-05 11:00:00", "2015-05-05 13:00:00", "Haircut -- Vince Chase", 1, 12, "Kieron - haircut w/ Vince chase");

/*Adding seperate unit_id column in Employee in order to seperate it from the PKey ID 
If users wanted to change the order of employees in the calendar, then you would nee to switch
the pkeys.
NOTE: When adding employees, will need to set the unit_id manually by getting the highest value and adding 1
*/
ALTER TABLE Employee ADD COLUMN Unit_ID smallint(10) UNSIGNED UNIQUE;
UPDATE Employee SET Unit_ID=1 WHERE ID=1;
UPDATE Employee SET Unit_ID=2 WHERE ID=2;
UPDATE Employee SET Unit_ID=3 WHERE ID=3;
UPDATE Employee SET Unit_ID=4 WHERE ID=4;
UPDATE Employee SET Unit_ID=5 WHERE ID=5;

UPDATE Employee SET Unit_ID=6 WHERE ID=2;
UPDATE Employee SET Unit_ID=1 WHERE ID=1;
UPDATE Employee SET Unit_ID=2 WHERE ID=2;


ALTER TABLE Appointment2 ADD COLUMN Unit_ID smallint(10);
ALTER TABLE Appointment2
	MODIFY Unit_ID smallint(10) UNSIGNED;
	
ALTER TABLE Appointment2 DROP FOREIGN KEY appointment2_ibfk_3;
ALTER TABLE Appointment2
	ADD CONSTRAINT
	FOREIGN KEY (Unit_ID) REFERENCES Employee(Unit_ID)
	ON UPDATE CASCADE;









/*If a customer or employee are deleted, then remove the customer or employee, but keep the record in Appointment.
The SET NULL constraint will set the customerid or employeeid to NULL in table if that customer or employee are deleted*/
ALTER TABLE Appointment DROP FOREIGN KEY appointment_ibfk_1;
ALTER TABLE Appointment
	ADD CONSTRAINT
	FOREIGN KEY (CustomerID) REFERENCES Customer(ID)
	ON DELETE SET NULL;
	
ALTER TABLE Appointment DROP FOREIGN KEY appointment_ibfk_4;
ALTER TABLE Appointment
	ADD CONSTRAINT
	FOREIGN KEY (EmployeeID) REFERENCES Employee(ID)
	ON DELETE SET NULL;

/*NOTE: The Employee.ID column is now used to indicate the unit ID number on the calendar. 
Ex - Kieron = 1, Tiara = 2, etc. */
	
/* This table stores the services done for each appointment. There can be multiple services for one appointment,
so having this table reduces redundancy in the Appointment table, and normalizes the database (1NF)*/
CREATE TABLE Appointment_Service (
	ID INT(25) UNSIGNED NOT NULL AUTO_INCREMENT,
	Appt_ID INT(25) UNSIGNED,
	Service_Name VARCHAR(256),
	FOREIGN KEY (Appt_ID) REFERENCES Appointment(Appt_ID),
	FOREIGN KEY (Service_Name) REFERENCES Service(Name),
	PRIMARY KEY (ID)
);
/*If an appointment is deleted, delete that appt_id from Appointment_Service*/
ALTER TABLE Appointment_Service DROP FOREIGN KEY appointment_service_ibfk_1;
ALTER TABLE Appointment_Service
	ADD CONSTRAINT
	FOREIGN KEY (Appt_ID) REFERENCES Appointment(Appt_ID)
	ON DELETE CASCADE;

/*
NOTE:
Did not add CustomerName, or EmployeeName as columns. May add these later.
MySQL can have Foreign keys reference non-primary keys, as long as the non-primary key has the UNIQUE constraint.
Not sure if this is good practice for customerName since there may be duplicates (no UNIQUE constraint on customerName). 
Referencing Primary keys ensures referential integrity.
-->difference between UNIQUE and PRIMARY KEY is that you can have multiple UNIQUE constraints per table, but only one PK

As is, the CustomerID, EmployeeID, and ServiceName columns can contain NULL values, even though they are foreign keys.
Considering adding the NOT NULL constraint in order to prevent this

TIME fields in MySql are HH:MM:SS.
11:22 is interpreted as 11:22:00
https://dev.mysql.com/doc/refman/5.1/en/time.html

4/16
Dropping the Duration column from the Service table, since user will be setting the duration of the appointment.
This is done through the 
ALTER TABLE Service DROP COLUMN Duration

NOTE: MySQL allows you to have multiple statements per ALTER TABLE. For example:
ALTER TABLE T DROP COLUMN A, DROP COLUMN B
--SQL forces you to use multiple ALTER TABLE statements

Also dropped the ServiceName column from the Appointment table.
This is no longer needed since each Appointment can have multiple services (this is the reason for the Appointment_Service table).
First had to remove the foreign key constraint for the ServiceName column. I got the name of the constraint by using:
mysql> show create table appointment;

Then with the contraint name, I ran:
mysql>alter table appointment drop foreign key constraint_name;

Then deleted the column:
mysql>alter table appointment drop column serviceName;
*/