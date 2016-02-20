Indexes:
An index optimizes performance of the database, and can be created for a column or multiple columns. 
The index stores the data in that column in a data structure, allowing faster performance when doing a SELECT statement where the column with the index is in the WHERE clause, or used in an ORDER BY clause.

You want to use an index on a column of a table that is large in size, and the column is used frequently in WHERE clauses.

A column which is a Primary Key is indexed by default.

The following command can be used to create an index:
mysql> CREATE INDEX index_name ON table_name(column_name);

The one drawback of using Indexes is that it will slow down Insert, Update, and Delete commands. 
This is because when executing these queries, they need to be done in the table, AND in the index.

Prefix Indexes:
You can create an index on a prefix of a column of a String data type.
column_name(10);
creates an index for only the first 10 characters of the data in the column_name column.
This makes the index file smaller.

Multiple Column Indexes:
Can create an index for multiple columns
mysql> CREATE INDEX index_name ON table_name(col1, col2);

When deciding on whether the index is actually used, the left-most column takes precedence.
For example, a query searching for a combination of values in col1 and col2 would use the index.
A query searching for values just in col1 would use the index.
However, one for just col2 would not.
MySQL documentation on multiple column indexes:
https://dev.mysql.com/doc/refman/5.5/en/multiple-column-indexes.html

