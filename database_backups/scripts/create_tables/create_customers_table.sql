CREATE TABLE IF NOT EXISTS Customer(
	ID INT(25) UNSIGNED NOT NULL AUTO_INCREMENT,
	Name VARCHAR(256),
	Gender VARCHAR(10),
	CellPhoneNumber VARCHAR(20),
	HomePhoneNumber VARCHAR(20),
	EmailAddress VARCHAR(256),
	HomeAddress VARCHAR(512),
	Birthday DATE,
	Notes VARCHAR(512),
	AllowText VARCHAR(5),
	AllowEmail VARCHAR(5),
	CONSTRAINT chk_Allows CHECK (AllowText='T' OR AllowText='F' OR AllowEmail='T' OR AllowEmail='F'),
	CONSTRAINT chk_Gender CHECK(Gender='Male' OR Gender='Female'),
	PRIMARY KEY (ID)
);


CREATE TABLE IF NOT EXISTS Parent_Child(
	Parent_ID INT(25) UNSIGNED NOT NULL,
	Child_ID INT(25) UNSIGNED NOT NULL,
	FOREIGN KEY (Parent_ID) REFERENCES Parent(Parent_ID),
	FOREIGN KEY (Child_ID) REFERENCES Child(Child_ID)
);
/* If a customer is delete that is either a child or a parent, also delete that person
from the Parent and/or Child table */
ALTER TABLE Parent DROP FOREIGN KEY parent_ibfk_1;
ALTER TABLE Parent
	ADD CONSTRAINT
	FOREIGN KEY (CustomerID) REFERENCES Customer(ID)
	ON DELETE CASCADE;
ALTER TABLE Child DROP FOREIGN KEY child_ibfk_1;
ALTER TABLE Child
	ADD CONSTRAINT
	FOREIGN KEY (CustomerID) REFERENCES Customer(ID)
	ON DELETE CASCADE;
	
/*If a customer is deleted that is in the Parent_Child table, also delete that relationship
in the Parent_Child table. */
ALTER TABLE Parent_Child DROP FOREIGN KEY parent_child_ibfk_1;
ALTER TABLE Parent_Child
	ADD CONSTRAINT
	FOREIGN KEY (Parent_ID) REFERENCES Parent(Parent_ID)
	ON DELETE CASCADE;
ALTER TABLE Parent_Child DROP FOREIGN KEY parent_child_ibfk_2;
ALTER TABLE Parent_Child
	ADD CONSTRAINT
	FOREIGN KEY (Child_ID) REFERENCES Child(Child_ID)
	ON DELETE CASCADE;
	
	
	
	
INSERT INTO Child (CustomerID) VALUES (22);
INSERT INTO Child (CustomerID) VALUES (23);
INSERT INTO Child (CustomerID) VALUES (24);

INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (1, 6);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (1, 7);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (1, 10);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (2, 8);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (2, 9);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (3, 11);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (3, 12);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (3, 13);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (4, 14);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (4, 15);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (4, 16);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (5, 14);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (5, 15);
INSERT INTO Parent_Child (Parent_ID, Child_ID) VALUES (5, 16);





SELECT Name
FROM Customer, Child, Parent, Parent_Child as P_C
WHERE Customer.ID = Child.CustomerID AND
Customer.ID = Parent.CustomerID AND
P_C.Child_ID = Child.Child_ID AND
P_C.Parent_ID = Parent.Parent_ID;

SELECT Name
FROM Customer, Parent, Parent_Child as P_C
WHERE 
Customer.ID = Parent.CustomerID AND
P_C.Parent_ID = Parent.Parent_ID;


/*Show all children for parent with a set customerid*/
Select Customer.Name, Customer.CellPhoneNumber
from child, parent, parent_child, customer
where child.child_id = parent_child.child_id and
parent.parent_id = parent_child.parent_id and
customer.id=child.customerid and
parent.customerid=18;

/*Show all parent(s) for a child with a set customerid*/
Select Customer.Name, Customer.CellPhoneNumber
from child, parent, parent_child, customer
where child.child_id = parent_child.child_id and
parent.parent_id = parent_child.parent_id and
customer.id=parent.customerid and
child.customerid=22;




/*

MAKE CELL NUMBER AND NAME REQUIRED!!

NOTE: format of DATE type is YYYY-MM-DD. This can NOT be changed, so will need to make changes to format in code.
Can also use the DATE_FORMAT function. 
https://dev.mysql.com/doc/refman/5.1/en/datetime.html
*/