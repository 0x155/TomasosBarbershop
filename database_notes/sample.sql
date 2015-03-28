CREATE TABLE Customers(
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(50) BINARY,
	cellNumber VARCHAR(12),
	homeNumber VARCHAR(12),
	address VARCHAR(50),
	emailAddress VARCHAR(50) UNIQUE,
	allowText BOOLEAN,
	allowEmail ENUM('Yes', 'No'),
	UNIQUE KEY (address),
	PRIMARY KEY(id)
);

/*
All character types have a collation, which is used to determine how characters in the field are compared.
Adding the BINARY attribute to the name field sets the collation to be case-sensitive
By default, the collation is case-insensitive. Using BINARY ensures there is no ambiguity in values ("john" is different than "John")
*/

/*
UNIQUE constraint can be added to fields to ensure their values are unique.
The difference between UNIQUE AND PRIMARY KEY is:
-You can have as many unique keys as youd like, but you can have only one primary key
-A field with the UNIQUE constraint can contain a NULL value, a primary key cannot contain a NULL value
*/

CREATE TABLE Members(
	id INT,
	username VARCHAR,
	password VARCHAR,
	firstName VARCHAR,
	lastName VARCHAR
);