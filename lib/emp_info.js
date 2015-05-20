/*This JSON object will hold employee information which is critical for scheduling appointments,
but does not necessarily need to be stored in the database. Currently, the employee's name, 
color which their appointments will appear on the calendar, and unit_id are stored. 
Note when any of this information needs to be changed by the user, it will need to be changed here as well. 
Will need to make sure unit_id is continuous and increments by 1 (note this wont be a database column) */
var employees = [
	{"name":"Kieron", "color":"#3A87AD", "unit_id":1},
	{"name":"Tiara", "color":"#FF887C", "unit_id":2},
	{"name":"Doug", "color":"#F58839", "unit_id":3},
	{"name":"Melvin", "color":"#368C23", "unit_id":4},
	{"name":"Jackie", "color":"#C353E8", "unit_id":5}
];