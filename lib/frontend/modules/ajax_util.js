// Will contain all AJAX functions

var path = require("path");
var controllersDir = "controllers";

var AjaxUtil = {

    customerSearch: function(event, content, filter, callback) {
        var res = {},
            searchButton = event.currentTarget;

        // Disable search button until request completes
        searchButton.disabled = true;

        $.ajax({
            type: 'GET',
            url: path.join(controllersDir, "get_customer_data.php"),
            data: {
                content: content,
                filter: filter
            },
            success: function(results) {
                // Check length
                // if length === 0, set type to none
                // if length === 1, set type to one
                // if length > 1, set type to many

                // NOTE results comes back as a string
                // since PHP is echo'ing it
                var results = JSON.parse(results);

                if (results.length === 0) {
                    res.type = "none";
                }
                else if (results.length === 1) {
                    res.type = "one"
                    res.customer = results;
                }
                else if (results.length > 1) {
                    res.type = "many",
                    res.customers = results;
                }

                if (callback) {
                    callback(res);
                }
            },
            error: function(results) {
                console.error("Failure in customerSearch: ", results);
            },
            complete: function() {
                // complete callback is called whether success or failure
                // Note it is called AFTER either success/error callback
                searchButton.disabled = false;
            }
        });
    },

    updateCustomerInfo: function(info, callback) {
        $.ajax({
            type: 'POST',
            url: "update_customer_info.php",
            data: info,
            success: function(data) {
                if (callback) {
                    callback(data);
                }
            },
            error: function(data) {
                console.error("Failure in updateCustomerInfo: ", data);
            }
        });
    },

    getFullCustomerHistory: function(customer, callback, startRow, numRows) {
        if(typeof(startRow) === "undefined"){
    		startRow = 0;
    	}
    	if(typeof(numRows) === "undefined"){
    		numRows = 5;
    	}
        $.ajax({
            type: 'GET',
            url: 'get_customer_history.php',
            data: {
                customer: customer,
                startRow: startRow,
                numRows: numRows
            },
            success: function(data){
                if (callback) {
                    callback(JSON.parse(data));
                }
            },
            error: function(data) {
                console.error("Failure in getFullCustomerHistory: ", data);
            }
        });
    }
};

module.exports = AjaxUtil;
