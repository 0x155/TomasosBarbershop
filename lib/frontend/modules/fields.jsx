var React = require('react');
var ReactDOM = require('react-dom');

var Fields = React.createClass({

    render: function() {
        return (
            <p>Hi from React!</p>
        );

    },


  bindEvents: function() {

    // Attach click event to $(.filter)
    // These add/remove the active-filter class
    // and focus the customer_name text field

    // Attach click event for customerSearch()

    /*
    change Event for service
    If Unavailable
      -show unavailable form fields
      -disable start-time
      -disable customer_name field
      -disable customer search button
    else
      -hide unavailable form fields
      -enable fields
    */

    /*
    unavailable-all-day
    When checked, disable both unavailable-start-time and unavailable-end-time
    */



  }

});
module.exports = Fields;
