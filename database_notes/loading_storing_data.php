<!-- NOTES ON HOW TO LOAD DATA FROM A DATABASE, AND WRITE DATA BACK TO DATABASE 
http://docs.dhtmlx.com/scheduler/loading_data.html#loadingdatafromadatabase
http://docs.dhtmlx.com/scheduler/server_integration.html
-->
<html>
	<head></head>
	<body>
		<?php
		/*
		dhtmlxConnector - server-side library
		http://docs.dhtmlx.com/connector__php__index.html

		dataProcessor - client-side library (included in dhtmlxscheduler.js)
		http://docs.dhtmlx.com/dataprocessor__index.html
		*/

		/*Client-side calls load() method
		scheduler.init('scheduler_here', new Date(), "month");
		scheduler.load("events.php");

		var dp = new dataProcessor("file.php");
		dp.init(scheduler);
		*/

		include ('dhtmlxConnector/codebase/scheduler_connector.php');
 
		$res=mysql_connect("localhost","root","");	//connect to DB server
		mysql_select_db("sampleDB");	//sampleDB is database name
		 
		$calendar = new SchedulerConnector($res, "MySQL"); //2nd arg is MySql by default
		$calendar->render_table("appointments","id","date, customerName, employeeName, startTime, endTime, 
								serviceName, notes","extra");
		//arguments for render_table are tablename, identity field(optional - i think this is the primary key),
		//and list of fields to be used as event's data properties (I think these are column names)
		//render_table() is best when working with one database table

		//This loads data statically

		//Can also load data dynamically (not everything all at once),
		//by specifying unit to load at once (day, month, year, etc.) on client-side


		?>
	</body>
</html>