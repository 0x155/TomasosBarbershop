var React = require('react');
var Util = require('../util');

var CustomerSearchResultItem = React.createClass({

    // TODO
    // If user double clicks on a row,
    // Close the window, and populate the customer
    // name field with that customers name
    // See if React has an onDoubleClick event

    render: function() {
        var customer = this.props.customer,
            classes = "cust-search-row";

        // If row is selected,
        // then add cust-search-selected class,
        // and check the radio button for that row
        if (this.props.selected) {
            classes += " cust-search-selected";
        }



        // TODO - format CellPhoneNumber
        return (
            <tr className={classes} onClick={this.props.selectCustomer.bind(null, customer)}>
                <td><input type="radio" name="customer-name" checked={this.props.selected} /></td>
                <td>{customer.Name}</td>
                <td>{Util.formatPhoneNumber(customer.CellPhoneNumber)}</td>
                <td>{customer.EmailAddress}</td>
            </tr>
        );
    }
});

module.exports = CustomerSearchResultItem;
