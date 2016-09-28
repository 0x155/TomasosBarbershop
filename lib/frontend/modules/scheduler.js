/*
The dhtmlxscheduler library creates a global variable scheduler.
TODO use an IIFE to create a private scope

TODO - install dhtmlxscheduler as a npm package?
https://www.npmjs.com/package/dhtmlx-scheduler
*/

// Ideally want to make a Scheduler class
function Scheduler() {
  //...
  // can have private functions here
  // function privateFunction(){}

  // But also functions to expose:
  // this.pubicFunc = function() {...}
}
// But dont know how to export it

//JavaScript to set up the DHTMLX Scheduler
scheduler.createUnitsView({
    name:"unit",
    property:"Unit_ID", //the name of a data property that will be used to assign events to certain units

    //True so events not assigned to a unit will not be displayed.
    //Otherwise, incorrect events would go to the first unit
    skip_incorrect: true,

    //gets list from PHP script
    list:scheduler.serverList("Unit_ID")
});

//NOTE: config info such as this must come before the init method
scheduler.config.first_hour = 9;
scheduler.config.last_hour = 20;

//Change hour scale to 12-hours instead of Military
scheduler.config.hour_date = "%h:%i %A";

//Change height of the hour scale
scheduler.config.hour_size_px = 176;

//formats Date at the top of calendar
scheduler.config.default_date = "%l %F %j";

//changes the format of the date when parsing
//The expected format of the calendar is MM/DD/YYYY, but the
//format in the database is YYYY-MM-DD HH:MM:SS
scheduler.config.xml_date = "%Y-%m-%d %H:%i:%s";

//sets the format for the start_time and end_time properties when addEvent is called
scheduler.config.api_date = "%m/%d/%Y %H:%i";

//Brings up the light box when you double click on an event in the calendar
scheduler.config.details_on_dblclick=true;

//Does not create events if user double clicks on empty cell
scheduler.config.dblclick_create = false;

//shows a spinning logo while the data loads
scheduler.config.show_loading = true;

//Does not allow user to drag or move events on calendar
//may change later
scheduler.config.drag_move = false;

//sets the time interval when double clicking on empty cells
scheduler.config.time_step = 15;


//-----Adding 15min time interval on y-axis---------
//date_to_str returns a function which converts a Date object to the specified format
var hour_format = scheduler.date.date_to_str("%h:%i %A");
var step = 15; //15 min interval
scheduler.templates.hour_scale = function(date){
  var html = "";
  for(var i = 0; i < (60/step); i++) {
    html += "<div style='height:40px;line-height:40px'>"+hour_format(date)+"</div>";

    //adds 15 mins to the date
    date = scheduler.date.add(date, step, "minute");
  }
  return html;
};

/*
TO-DO: Display the customer's phone number in the title of the quick-info box.
If the customer has no number stored, leave it blank
*/
scheduler.templates.quick_info_title = function(start, end, ev){
  return ev.text;
};


/*
When there is a collision detected, a dhtmlx error message is displayed,
and the collision global variable is set to true.
The colliding event is added to the DB, but it will be deleted
*/
scheduler.attachEvent("onEventCollision", function (ev, evs) {
	dhtmlx.alert({
		type:"alert-error",
		text: "There is already an appointment scheduled for that time",
		position: "top"
	});

	//if lightbox is opened, display evs
	// if(scheduler.getState().lightbox_id){}

	collision = true;
	//returning false here allows for the event to be inserted into the DB (proceed as normal)
	//This is okay since it will be deleted using scheduler.deleteEvent
	return false;
});

scheduler.attachEvent("onEventAdded", function(id,ev){
  if(!collision){
  	dhtmlx.message({
			type: "msgWindow",
			text: "Appointment Created!"
		});
  }
});

scheduler.attachEvent("onEventDeleted", function(id){
	if (!collision) {
		dhtmlx.message({
			type: "error",
			text: "Appointment Deleted!"
		});
	}
});

//When the date is changed on the calendar,
//set the date for the datepicker to this new date
scheduler.attachEvent("onViewChange", function (new_mode , new_date){
    $('#date').datepicker('update', new_date);
});

//set the time in the time-picker to the time the user selected in the empty cell
//also set the employee dropdown to the employee the user has clicked under
scheduler.attachEvent("onEmptyClick", function (date, e){
     $('#start-time').timepicker('setTime', date);
     $("#unavailable-start-time").timepicker('setTime', date);
     $("#unavailable-end-time").timepicker('setTime', date);
     //also set the selected value of the Employee dropdown to the name of the column under which the user clicked
     var action = scheduler.getActionData(e);
     document.getElementById("employee-dropdown").selectedIndex = action.section;
});


/*
This event is triggered when the automated ID is changed into the ID to be
used as an ID in the database. When this occurs, if the new event is a colliding event,
that event is deleted, and collision is reset to false.
*/
scheduler.attachEvent("onEventIdChange", function(old_id,new_id){
  if(collision){
    scheduler.deleteEvent(new_id);
    collision = false;
  }
});

//Initialize scheduler
scheduler.init('scheduler_here', new Date(), "unit");
/*
This allows for dynamic loading of data. Setting the load mode to "week"
allows for data for a particular week to be loaded at once, instead of every single event.
http://docs.dhtmlx.com/scheduler/loading_data.html#dynamicloading
*/
scheduler.setLoadMode("week");

scheduler.load("lib\\load_events.php");
