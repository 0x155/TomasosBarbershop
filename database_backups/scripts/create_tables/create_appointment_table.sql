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

UPDATE Employee SET Unit_ID=6 WHERE ID=3;
UPDATE Employee SET Unit_ID=4 WHERE ID=4;
UPDATE Employee SET Unit_ID=3 WHERE ID=3;

UPDATE Employee SET Unit_ID=10 where id=2;
UPDATE Employee SET Unit_ID=3 where id=3;
UPDATE Employee SET Unit_ID=2 where id=2;







	
/* This table stores the services done for each appointment. There can be multiple services for one appointment,
so having this table reduces redundancy in the Appointment table, and normalizes the database (1NF)*/
CREATE TABLE Appointment_Service (
	ID INT(25) UNSIGNED NOT NULL AUTO_INCREMENT,
	Appt_ID INT(25) UNSIGNED,
	Service_Name VARCHAR(256),
	FOREIGN KEY (Appt_ID) REFERENCES Appointment(ID) ON DELETE CASCADE,
	FOREIGN KEY (Service_Name) REFERENCES Service(Name),
	PRIMARY KEY (ID)
);
/*If an appointment is deleted, delete that appt_id from Appointment_Service*/
ALTER TABLE Appointment_Service DROP FOREIGN KEY appointment_service_ibfk_1;
ALTER TABLE Appointment_Service
	ADD CONSTRAINT
	FOREIGN KEY (Appt_ID) REFERENCES Appointment(Appt_ID)
	ON DELETE CASCADE;

/* If an employee is deleted from the system, do not delete the appointments
for that employee. The customer still came in and received services. 
Set Appointment.EmployeeID to NULL if an employee is deleted*/
ALTER TABLE Appointment DROP FOREIGN KEY appointment_ibfk_2;
ALTER TABLE Appointment
	ADD CONSTRAINT
	FOREIGN KEY (EmployeeID) REFERENCES employee(ID)
	ON DELETE SET NULL;
	
ALTER TABLE Appointment DROP FOREIGN KEY appointment_ibfk_3;
ALTER TABLE Appointment
	ADD CONSTRAINT
	FOREIGN KEY (Unit_ID) REFERENCES employee(Unit_ID)
	ON DELETE SET NULL 
	ON UPDATE CASCADE;	

/*Same for Employee.
If an Employee is deleted, do not delete the appointments for that customer.
The stylist still deserves credit for that appointment. */
ALTER TABLE Appointment DROP FOREIGN KEY appointment_ibfk_1;
ALTER TABLE Appointment
	ADD CONSTRAINT
	FOREIGN KEY (CustomerID) REFERENCES customer(ID)
	ON DELETE SET NULL;	

SELECT date_format(A.start_date, "%m/%d/%Y") as Date, A.Text, E.Name, A.Notes
FROM Appointment as A, Employee as E
WHERE A.CustomerID=85 AND E.ID = A.EmployeeID
ORDER BY Date DESC;

/*Get the employee which the customer has seen most often, along with # of visits */
SELECT COUNT(*) visits, E.name, C.Name
FROM Appointment A, Employee E, Customer C
WHERE A.employeeid=E.ID AND A.customerid=C.ID AND customerid=8
GROUP BY employeeid, customerid
ORDER BY visits DESC LIMIT 1;

/*Date of most recent visit for a customer */
SELECT date_format(start_date, "%m/%d/%Y") date
FROM Appointment
WHERE customerid=8
ORDER BY date DESC LIMIT 1;

/*Date of first visit for a customer */
SELECT date_format(start_date, "%m/%d/%Y") date
FROM Appointment
WHERE customerid=8
ORDER BY date ASC LIMIT 1;


CREATE TABLE User(
	ID INT(25) UNSIGNED NOT NULL AUTO_INCREMENT,
	Username VARCHAR(256) NOT NULL,
	Password VARCHAR(256) NOT NULL,
	LastLogin DATETIME,
	PRIMARY KEY (ID)
);

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

Notes on parentheses in column defintions
The value has different meanings for ints and varchars
varchar(5)
Values in that column cannot be longer than 5 characters long.
You can insert values into that column that are longer than 5 with not error, but only 5 characters will be stored

int(5)
5 is the maximum display width of the column
This is NOT the range of the value. Each integer type (smallint, int, bigint, etc.) has their own numeric range for values
The value in the parentheses is the MAXIMUM display width.
If a value in that column is greater than 5 digits long, it can be stored, and will display all digits
https://blogs.oracle.com/jsmyth/entry/what_does_the_11_mean
The largest negative value for an int is -2147483648
Therefore the default display width is 11 (includes the sign)
This is easily demonstrated using ZEROFILL which pads the values

*/











