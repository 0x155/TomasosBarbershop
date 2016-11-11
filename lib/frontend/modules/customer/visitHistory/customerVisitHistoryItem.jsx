var React = require('react');

var CustomerVisitHistoryItem = React.createClass({

    render: function() {
        var visit = this.props.visit;
        
        return (
            <tr>
                <td>{ visit.Appt_Date }</td>
                <td>{ visit.EmpName }</td>
                <td>{ visit.ServiceName }</td>
            </tr>
        );
    }
});

module.exports = CustomerVisitHistoryItem;
