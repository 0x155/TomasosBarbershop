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

/*

MAKE CELL NUMBER AND NAME REQUIRED!!

NOTE: format of DATE type is YYYY-MM-DD. This can NOT be changed, so will need to make changes to format in code.
Can also use the DATE_FORMAT function. 
https://dev.mysql.com/doc/refman/5.1/en/datetime.html
*/