var React = require('react');
var CustomerVisitHistoryItem = require('./customerVisitHistoryItem');

var CustomerVisitHistory = React.createClass({

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
            </div>
        );
    }
});

module.exports = CustomerVisitHistory;
