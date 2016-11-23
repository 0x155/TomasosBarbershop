var React = require('react');
var CustomerVisitHistoryItem = require('./customerVisitHistoryItem');
var AjaxUtil = require('./../../ajax_util');
// The require call here compiles the template and returns a function
// When the rest of the JS uses modules, use the templates this way,
// instead of compiling, and then importing compiledTemplates.js
var CustomerHistoryTemplate = require('templates/fullCustomerHistory');

var CustomerVisitHistory = React.createClass({

    openFullVisitHistory: function() {
        // template needs customer obj for data to
        // display on the left

        // TODO add Pagination so the user can view more of the customer's history
        AjaxUtil.getFullCustomerHistory(this.props.customer, function(data){
            var content = CustomerHistoryTemplate({
                customer: this.props.customer,
                visitHistory: data[0]
            });
            // Pass content into DOM
            document.getElementById("customer_history").innerHTML = content;
        }.bind(this));

    },

    render: function() {
        var visits;

        visits = this.props.visits.map(function(visit, index){
            return <CustomerVisitHistoryItem visit={visit} key={index} />
        });

        // this.props.visits will be an array of visits
        // loop through this.props.vists, creating an instance of CustomerVisitHistoryItem
        // for each one
        return (
            <div>
                <table className="customer-history-table">
                    <thead>
                        <tr>
                            <th id="date-head">Date</th>
                            <th id="emp-head">Employee</th>
                            <th id="service-head">Service</th>
                        </tr>
                    </thead>
                    <tbody>
                        { visits }
                    </tbody>
                </table>
                <p><b>First Visit: </b>{this.props.firstVisit}</p>
                <button
                    onClick={this.openFullVisitHistory}
                    className="btn_default_cb">
                    View All History
                </button>
            </div>
        );
    }
});

module.exports = CustomerVisitHistory;
