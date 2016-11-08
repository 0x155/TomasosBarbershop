// Will contain all AJAX functions

var path = require("path");
var controllersDir = "controllers";

var AjaxUtil = {

    customerSearch: function(content, filter, callback) {
        var res = {};
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
            failure: function() {
                console.error("Failure in customerSearch");
            }
        });
    },

    updateCustomerInfo: function(info, callback) {
        console.log("Customer: ", info);
        $.ajax({
            type: 'POST',
            url: "update_customer_info.php",
            data: info,
            success: function(data) {
                console.log("Success: ", data);
                if (callback) {
                    console.log("Calling callback....");
                    callback(data);
                }
            },
            failure: function() {
                alert("Failure in updateCustomerInfo");
            }
        });
    }
};

module.exports = AjaxUtil;
