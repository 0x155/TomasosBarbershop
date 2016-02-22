# Schema Information

## appointment
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
start_date  | datetime  |
end_date    | datetime  |
text        | string    | varchar(256)
EmployeeID  | integer   | foreign key (references employee.id)
CustomerID  | integer   | foreign key (references customer.id)
Notes       | string    | varchar(256)
color       | string    | varchar(7)
Unit_ID     | integer   | foreign key (references employee.Unit_ID)

## appointment_service
column name  | data type | details
-------------|-----------|-----------------------
id           | integer   | not null, primary key
Appt_ID      | datetime  | foreign key (references appointment.id)
Service_Name | datetime  | foreign key (references service.name)

## customer
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
Name            | string    | varchar(256)
Gender          | string    | default NULL
CellPhoneNumber | string    | default NULL
HomePhoneNumber | integer   | default NULL
EmailAddress    | integer   | default NULL
HomeAddress     | string    | default NULL
Birthday        | string    | default NULL
Notes           | integer   | foreign key (references employee.Unit_ID)
AllowText       | string    | varchar(5) default NULL
AllowEmail      | string    | varchar(5) default NULL

## employee
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
Name            | string    | varchar(256)
CellPhoneNumber | string    | NOT NULL
HomePhoneNumber | integer   | NOT NULL
EmailAddress    | integer   | NOT NULL
Unit_ID         | integer   | default NULL

## service
column name     | data type | details
----------------|-----------|-----------------------
name            | string    | varchar(256) not null, primary key

## user
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
Username        | string    | varchar(256), NOT NULL
Password        | string    | varchar(256), NOT NULL, encrypted
LastLogin       | datetime  | 
