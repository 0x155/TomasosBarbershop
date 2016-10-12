var React = require('react');

var NoCustomerSearchResults = React.createClass({

    openNewCustomerWindow: function() {
        console.log("--open customer window");
    },

    // TODO - need to tell this component where to render
    // When Yes butotn is clicked, open the addNewCustomer form
    // When No button is clicked, this component should close
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
