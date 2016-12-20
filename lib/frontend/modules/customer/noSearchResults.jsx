var React = require('react');
var AddNewCustomerTemplate = require('templates/addNewCustomerForm');

var NoCustomerSearchResults = React.createClass({

    openNewCustomerWindow: function() {
        var name,
            cellPhoneNumber,
            filter = this.props.filter;

        this.props.closeResults();

        if (filter === "name") {
            name = this.props.search;
        }
        else if (filter === "number") {
            cellPhoneNumber = this.props.search;
        }

        var content = AddNewCustomerTemplate({
            name: name,
            cellPhoneNumber: cellPhoneNumber
        });

        document.getElementById("new-customer-modal-container").innerHTML = content;
    },

    render: function() {
        return (
            <div id="no-customer-returned">
                <p>This search returned no customers. Would you like to add a new customer?</p>
                <div className="btn-group">
                    <button type="button" className="btn_default_cb no-cust-btn"
                            id="no-cust-btn-yes"
                            onClick={this.openNewCustomerWindow}>Yes</button>
                    <button type="button" className="btn_default_cb no-cust-btn"
                            id="no-cust-btn-no"
                            onClick={this.props.closeResults}>No</button>
                </div>
            </div>
        )
    }
});

module.exports = NoCustomerSearchResults
