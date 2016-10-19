// Will contain all AJAX functions
// Maybe seperate them by purpose (Employee, Customer, Appointment, etc.)
var path = require("path");
var baseUrl = path.join(__dirname, "..", "..", "..");

var AjaxUtil = {

    customerSearch: function(content, filter, callback) {
        var res = {};
        $.ajax({
            type: 'GET',
            url: 'controllers\\get_customer_data.php',
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


        // return {
        //     type: "many",
        //     customers: [
        //         {
        //             id: 1,
        //             name: "Christian Bonacore",
        //             cellPhoneNumber: "6314334415",
        //             emailAddress: "christian.bonacore@gmail.com",
        //             visits: [
        //                 {
        //                     id: 1,
        //                     employee: "Kieron",
        //                     title: "Haircut, Beard Trim"
        //                 }
        //             ]
        //
        //         },
        //         {
        //             id: 2,
        //             name: "Dylan Bonacore",
        //             cellPhoneNumber: "6311113333",
        //             emailAddress: "dylan.bonacore@gmail.com",
        //             visits: [
        //                 {
        //                     id: 2,
        //                     employee: "Piotr",
        //                     title: "Haircut"
        //                 }
        //             ]
        //         },
        //         {
        //             id: 3,
        //             name: "Maria Bonacore",
        //             cellPhoneNumber: "5167891234",
        //             emailAddress: "mia.bonacore@gmail.com",
        //             visits: [
        //                 {
        //                     id: 3,
        //                     employee: "Tiara",
        //                     title: "Color"
        //                 }
        //             ]
        //         },
        //         {
        //             id: 4,
        //             name: "Jon Bonacore",
        //             cellPhoneNumber: "6319031514",
        //             emailAddress: "jon.bonacore@gmail.com",
        //             visits: [
        //                 {
        //                     id: 2,
        //                     employee: "Piotr",
        //                     title: "Haircut"
        //                 }
        //             ]
        //         }
        //     ]
        // };
    }
};

module.exports = AjaxUtil;
