var React = require('react');
var ReactDOM = require('react-dom');
var AjaxUtil = require('./../ajax_util');
var CustomerSearchResults = require('./customerSearchResults');

/*
This is a component just for the customer search bar.
It contains the field to enter a customer's name to search,
and a filter to search by either name or phone number.
Seperating this into its own component seperates concerns.

TODO
1.) If customer is searching by phone number, only allow them to type numbers
Also add max length of 10 or 12
*/
var CustomerSearch = React.createClass({

    getInitialState: function() {
        return {
            content: "",
            filter: "name",
            results: undefined
        };
    },

    // this.customerNameField is set by the
    // callback in the input field ref
    // We want this field to be focused when the component renders
    componentDidMount: function() {
        if (this.searchField) {
            this.searchField.focus();
        }
    },

    // Alternate search filter
    changeFilter: function(event) {
        // this.searchField.focus();
        this.setState({
            filter: event.currentTarget.id
        });
    },

    updateContent: function(event) {
        this.setState({
            content: event.currentTarget.value
        });
    },

    customerSearch: function() {
        var state = this.state,
            content = state.content,
            newContent = content,
            filter = state.filter,
            results;

        // If length of content is 0, then user didnt enter anything
        // dont do search, return same as no results
        if (content.length === 0) {
            results = {
                type: "none"
            }
        }
        else {
            // TODO - Disable Search button until search returns
            // Set this.state.results here, based on search results

            // Could have results be an object with type and content
            /*
            Result possibilities are the following:
            1.) User enters no text -> Return no customer found
            2.) Customer not found -> Return no customer found
            3.) Multiple results returned -> Show modal window of results
            4.) Match -> Show customer profile
            */
            results = AjaxUtil.customerSearch(content, filter);
        }

        // If results came back with a customer,
        // set state.content to the name so the text box will
        // populate with the returned customer name
        // Christian Bona ==> Christian Bonacore
        if (results.customer) {
            newContent = results.customer.name;
        }

        this.setState({
            results: results,
            content: newContent
        });

    },

    // This is passed to CustomerSearchResults component,
    // and is run when the user selects a customer from the
    // list of results, and clicks "Select"
    // This populates the customer search field with the
    // customer they selected, and then closes the window
    populateNameAndCloseWindow: function(customerName) {
        this.setState({
            content: customerName,
            results: undefined
        });
    },

    // Send this to the Children props displaying the results,
    // and attach this to click event for any close buttons.
    // This triggers a Parent re-render, but with no results
    closeResults: function() {
        this.setState({
            results: undefined
        });
    },

    render: function() {
        var state = this.state,
            activeFilter = state.filter,
            // nameClasses = "filter number-filter",
            // numberClasses = "filter name-filter";
            nameClasses = "filter",
            numberClasses = "filter",
            results,
            component = this;

        if (activeFilter === "name") {
            nameClasses += " active-filter";
        }
        else if (activeFilter === "number") {
            numberClasses += " active-filter";
        }

        // Results
        // Initially results is undefined, so this will be false,
        // and results will be empty
        if (state.results){
            results = <CustomerSearchResults
                        results={state.results}
                        closeResults={this.closeResults}
                        populateNameAndCloseWindow={this.populateNameAndCloseWindow}
                        search={state.content} />
        }

        // NOTE this.searchField is set in the ref callback,
        // which is called immediately after the component renders
        if (this.searchField) {
            this.searchField.focus();
        }

        return (
            <div>
                <div id="customer-info-top-fields">
                    <div className="cust-search-filters">
                        <div className={numberClasses} id="number" onClick={this.changeFilter}>
                            <h4>Phone Number</h4>
                        </div>
                        <div className={nameClasses} id="name" onClick={this.changeFilter}>
                            <h4>Name</h4>
                        </div>
                    </div>
                    <div className="input-group input-group-lg" id="cust-name-fields">
                        <input type="text" id="customer_name" className="form-control"
                                ref={function(name){
                                    component.searchField = name;
                                }}
                                placeholder="Search..."
                                value={state.content}
                                onChange={this.updateContent} />
                        <span className="input-group-btn">
                            <button type="button" className="btn btn-default"
                                    name="cust-search-button" id="cust-search-button"
                                    onClick={this.customerSearch}>Search
                            </button>
                        </span>
                    </div>
                </div>
                <div id="customer_search_results">
                    { results }
                </div>
            </div>
        );

    }

});
module.exports = CustomerSearch;
