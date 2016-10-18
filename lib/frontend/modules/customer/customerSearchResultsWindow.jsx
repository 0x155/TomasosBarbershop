var React = require('react');
var CustomerSearchResultItem = require('./customerSearchResultItem');

var CustomerSearchResultsWindow = React.createClass({
    getInitialState: function() {
        return({
            selectedCustomer: undefined
        });
    },

    // This is the onClick event for each of the
    // CustomerSearchResultItem components
    // It updates the state of the list
    selectCustomer: function(customer) {
        this.setState({
            selectedCustomer: customer
        });
    },

    selectAndCloseWindow: function() {
        this.props.populateNameAndCloseWindow(this.state.selectedCustomer.name);
    },

    closeWindow: function() {
        // this should call this.props.closeWindow
        // which is passed in from the parent
    },

    openNewCustomerWindow: function() {
        console.log("--Open new customer window from results");
    },

    render: function() {
        var props = this.props,
            state = this.state,
            customers;

        if (props.results.length > 0) {
            // map iterates through props.results, calls the function
            // for each element in the array, returning a new array
            customers = props.results.map(function(customer) {
                var selected = false;
                if ((state.selectedCustomer) && (customer.ID === state.selectedCustomer.ID)) {
                    selected = true;
                }
                return <CustomerSearchResultItem
                            customer={customer}
                            selected={selected}
                            selectCustomer={this.selectCustomer}
                            key={customer.ID} />
            }.bind(this));
        }


        return (
            <div id="modal_wrapper_cust_search_results" className="modal_wrapper">
                <div id="modal_cust_search_results">
                    <h4>Search Results for {props.search} </h4>
                    <table id="cust_search_results_table">
                        <tbody>
                            { customers }
                        </tbody>
                    </table>

                    <button type="button" id="select_cust_results_btn"
                            className="btn_default_cb"
                            onClick={this.selectAndCloseWindow}>Select</button>
                    <button type="button"
                            className="btn_default_cb"
                            onClick={props.closeResults}>Close</button>
                    <button type="button"
                            className="btn_default_cb"
                            onClick={this.openNewCustomerWindow}>Add Customer</button>
                </div>
            </div>
        );
    }
});

module.exports = CustomerSearchResultsWindow;
