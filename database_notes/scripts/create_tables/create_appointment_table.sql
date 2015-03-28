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

/*
NOTE:
Did not add CustomerName, or EmployeeName as columns. May add these later.
MySQL can have Foreign keys reference non-primary keys, as long as the non-primary key has the UNIQUE constraint.
Not sure if this is good practice for customerName since there may be duplicates (no UNIQUE constraint on customerName). 
Referencing Primary keys ensures referential integrity.

TIME fields in MySql are HH:MM:SS.
11:22 is interpreted as 11:22:00
https://dev.mysql.com/doc/refman/5.1/en/time.html
*/