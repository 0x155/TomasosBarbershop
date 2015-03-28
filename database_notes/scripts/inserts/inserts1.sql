/* CUSTOMER
INSERT INTO CUSTOMER (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday, Notes, AllowText, AllowEmail) VALUES ("Joe Swanson", "M", "631-111-2222", "", "swansonj@hotmail.com", "", "1989-09-08", "", "T", "T");
INSERT INTO CUSTOMER (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday, Notes, AllowText, AllowEmail) VALUES ("Laura-Jean Bonacore", "F", "516-333-7910", "", "ljrunner@yahoo.com", "", "1964-08-31", "Likes to run", "T", "F");
INSERT INTO CUSTOMER (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday, Notes, AllowText, AllowEmail) VALUES ("Ari Gold", "M", "631-777-8888", "", "golda@gmail.com", "", "1969-09-08", "", "F", "T");
INSERT INTO CUSTOMER (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday, Notes, AllowText, AllowEmail) VALUES ("Barbara Jones", "F", "631-123-4567", "631-567-1111", "", "51 Budenos Dr, Sayville, NY, 11782", "1960-12-18", "", "F", "T");
INSERT INTO CUSTOMER (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday, Notes, AllowText, AllowEmail) VALUES ("Christian Bonacore", "M", "631-433-2215", "", "cbonaco1@binghamton.edu", "2 Sampson Street, Sayville, NY 11782", "1989-09-08", "Developer of web site", "T", "T");
INSERT INTO CUSTOMER (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday, Notes, AllowText, AllowEmail) VALUES ("Dylan Bonacore", "M", "631-908-1514", "", "dbonacore@gmail.com", "", "1994-12-08", "", "T", "F");
INSERT INTO CUSTOMER (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday, Notes, AllowText, AllowEmail) VALUES ("Joseph Jones", "M", "631-111-4567", "", "jonesj@highschool.com", "51 Budenos Dr, Sayville, NY, 11782", "1992-11-11", "Son of Barbara", "T", "F");
INSERT INTO CUSTOMER (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday, Notes, AllowText, AllowEmail) VALUES ("Mike Jones", "M", "631-111-4568", "", "jonesm@highschool.com", "", "1990-10-11", "Other son of Barbara", "T", "T");
INSERT INTO CUSTOMER (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday, Notes, AllowText, AllowEmail) VALUES ("Mary Smith", "F", "631-333-2222", "", "smithm@hotmail.com", "55 Kemi Lane, Sayville, NY, 11782", "1969-03-11", "Just one female customer", "T", "T");
INSERT INTO CUSTOMER (Name, Gender, CellPhoneNumber, HomePhoneNumber, EmailAddress, HomeAddress, Birthday, Notes, AllowText, AllowEmail) VALUES ("Vince Chase", "M", "631-111-4444", "631-589-8899", "chasev@yahoo.com", "", "1989-10-03", "just one male customer", "T", "T");
*/

/* PARENT */
INSERT INTO Parent (CustomerID) VALUES (4);
INSERT INTO Parent (CustomerID) VALUES (6);

/* CHILD  */
INSERT INTO Child (CustomerID, Parent_ID) VALUES (7, 1); 
INSERT INTO Child (CustomerID, Parent_ID) VALUES (8, 1); 
INSERT INTO Child (CustomerID, Parent_ID) VALUES (9, 2);
INSERT INTO Child (CustomerID, Parent_ID) VALUES (10, 2);

/* APPOINTMENT */
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-27", 12, 1, "10:00", "10:30", "Haircut", "first appointment");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-27", 5, 1, "10:30", "11:00", "Haircut", "");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-27", 4, 3, "09:00", "09:30", "Color", "LJ color");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-27", 7, 3, "13:00", "13:30", "Haircut", "appointment with Christian");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-27", 8, 3, "14:00", "14:30", "Shave", "shave with Dylan");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-27", 9, 6, "12:00", "12:30", "Haircut", "Doug - haircut");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-28", 3, 5, "09:00", "09:30", "Haircut", "first with Melvin");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-28", 12, 5, "13:00", "13:15", "Beard Trim", "");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-28", 10, 7, "10:30", "11:00", "Haircut", "");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-28", 6, 7, "15:30", "15:45", "Eyebrow Wax", "Jackie - eyebrow wax");

INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-28", 5, 7, "09:30", "10:00", "Shave", "");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-29", 5, 7, "12:30", "13:00", "Haircut", "");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-30", 5, 7, "12:30", "13:00", "Haircut", "");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-28", 7, 1, "15:30", "15:45", "Haircut", "");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-29", 7, 1, "11:30", "12:00", "Haircut", "");
INSERT INTO Appointment (Appt_Date, CustomerID, EmployeeID, StartTime, EndTime, ServiceName, Notes) VALUES ("2015-03-29", 7, 1, "11:30", "12:00", "Shave", "");

/*Get all children whose parent id is 1 */
SELECT Customer.Name
FROM Customer, Parent, Child
WHERE Child.CustomerID = Customer.ID AND Child.Parent_ID = Parent.Parent_ID AND Parent.Parent_ID = 1;
/* Cannot use Parent.Parent_Name in last condition since Parent name may not be unique. Could potentially have parents with the same name */

/*Get parent of child with child id equal to 7*/
SELECT Customer.Name
FROM Customer, Parent, Child
WHERE Parent.CustomerID = Customer.ID AND Child.Parent_ID = Parent.Parent_ID  AND Child.Child_ID = 7;

/* Verify Laura-Jean is a parent */
SELECT Parent.Parent_ID, Customer.Name
FROM Parent, Customer
WHERE Parent.CustomerID = Customer.ID AND Customer.Name = "Laura-Jean Bonacore";

/* View appointments for a customer */
SELECT A.Appt_Date, E.Name, S.Name, A.Notes
FROM Appointment AS A, Employee AS E, Service AS S, Customer AS C
WHERE A.CustomerID = C.ID AND A.ServiceName = S.Name AND A.EmployeeID = E.ID AND C.Name="Ari Gold"
ORDER BY A.Appt_Date DESC;


















