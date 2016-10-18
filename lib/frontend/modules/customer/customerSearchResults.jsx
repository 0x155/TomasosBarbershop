/*
This component handles the logic for rendering the customer search results.
It looks at this.props.results, and based on what it contains,
returns and renders the appropriate React component.
The 3 different options are:
1.) Single result ==> Return a customer profile
2.) Multiple results ==> Return a list of all the matches
3.) No result ==> Return a message indicating there was no result found
*/

var React = require('react');
var NoCustomerResults = require('./noSearchResults');
var CustomerProfile = require('./customerProfile');
var CustomerSearchResultsWindow = require('./customerSearchResultsWindow');

var CustomerSearchResults = React.createClass({

    render: function() {
        var results = this.props.results,
            content;

        // this.props.results will be the results
        if (results.type === "none") {
            content = <NoCustomerResults closeResults={this.props.closeResults} />
        }
        else if (results.type === "one") {
            content = <CustomerProfile
                        closeResults={this.props.closeResults}
                        customer={results.customer} />
        }
        else if (results.type === "many") {
            content = <CustomerSearchResultsWindow
                        closeResults={this.props.closeResults}
                        populateNameAndCloseWindow={this.props.populateNameAndCloseWindow}
                        results={results.customers}
                        search={this.props.search} />
        }

        // Check value of this.props.results
        // and render a different component
        // based on the result
        /*
        Result possibilities are the following:
        1.) User enters no text -> Return no customer found
        2.) Customer not found -> Return no customer found
        3.) Multiple results returned -> Show modal window of results
        4.) Match -> Show customer profile
        */
        return(
            <div>
                { content }
            </div>
        );
    }
});

module.exports = CustomerSearchResults;
