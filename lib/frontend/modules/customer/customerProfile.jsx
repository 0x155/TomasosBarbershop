var React = require('react');
var Util = require('../util');
var AjaxUtil = require('../ajax_util');

var CustomerProfile = React.createClass({

    // When the profile is in edit mode,
    // the user can update information on the employee
    getInitialState: function() {
        // Using props to set the initial value of the
        // phoneNumber and emailAddress
        // These values will change if the user goes into edit mode
        var customer = this.props.customer;
        var number = Util.formatPhoneNumber(customer.CellPhoneNumber);
        return ({
            editMode: false,
            phoneNumber: number,
            emailAddress: customer.EmailAddress,
            errors: []
        });
    },

    // Called when this.props change
    // Added this to allow another customerProfile to be displayed
    // while one is currently being displayed. This was becuase the values
    // of the input fields for the profile check this.state
    // When the user does another search, this.state was not being updated,
    // so the new user profile wasnt being displayed
    componentWillReceiveProps: function(nextProps) {
        var currentState = this.state,
            nextCustomer = nextProps.customer;

        // Only interested when the props.customer is different
        if ((nextCustomer.CellPhoneNumber !== currentState.phoneNumber) &&
            (nextCustomer.EmailAddress !== currentState.emailAddress) ) {

            this.setState({
                phoneNumber: Util.formatPhoneNumber(nextCustomer.CellPhoneNumber),
                emailAddress: nextCustomer.EmailAddress
            });
        }
    },

    // Toggle between edit/non-edit mode
    toggleEditMode: function() {
        var current = this.state.editMode;
        this.setState({
            editMode: !current,
            errors: []
        });
    },

    updatePhoneNumber: function(e) {
        this.setState({
            phoneNumber: e.currentTarget.value
        });
    },

    updateEmailAddress: function(e) {
        this.setState({
            emailAddress: e.currentTarget.value
        });
    },

    // Validates what the user enters, then calls function
    // to update database
    updateCustomerInfo: function() {
        var phoneNumber = this.state.phoneNumber,
            emailAddress = this.state.emailAddress,
            phoneNumberValidation = Util.validatePhoneNumber(phoneNumber),
            emailAddressValidation = Util.validateEmailAddress(emailAddress);

        //TODO - on Cancel, need to hide error messages
        // Validate info the user entered
        if (phoneNumberValidation.valid && emailAddressValidation.valid) {
            AjaxUtil.updateCustomerInfo({
                phone: Util.stripPhoneNumber(phoneNumber),
                // phone: phoneNumber,
                email: emailAddress,
                customerID: this.props.customer.ID,
                customerName: this.props.customer.Name
            }, function(data) {
                // If response is a number, then
                // it is the number of rows updated (ideally 1)
                if (!isNaN(data)) {
                    this.setState({
                        editMode: false,
                        phoneNumber: phoneNumber,
                        emailAddress: emailAddress,
                        errors: []
                    });
                }
                // If NaN, then there was an error
                else {
                    var errors = JSON.parse(data);
                    this.setState({
                        editMode: true,
                        phoneNumber: phoneNumber,
                        emailAddress: emailAddress,
                        errors: errors
                    });
                }
            }.bind(this));

        }
        else {
            // If validation fails, don't make AJAX call, return error messages
            this.setState({
                errors: phoneNumberValidation.errorMessages.concat(emailAddressValidation.errorMessages)
            });
        }
    },

    render: function() {
        var customer = this.props.customer,
            disabled,
            saveButton,
            closeButton,
            outterClasses = "customer-history",
            editButtonText = "Edit Info",
            errorMessages;

        if (!this.state.editMode) {
            disabled = "true";
            closeButton = <button id="cust-history-close"
                            className="btn_default_cb btn_edit_cust_info"
                            onClick={this.props.closeResults}>Close[x]
                        </button>;
        }
        else {
            saveButton = <button className="btn_default_cb btn_edit_cust_info"
                            onClick={this.updateCustomerInfo}>Save
                        </button>;
            outterClasses += " editing_fields_area";
            editButtonText = "Cancel";
        }

        if (this.state.errors.length) {
            errorMessages = this.state.errors.map(function(error, index) {
                return <p className="ajax_error" key={index}>{error}</p>;
            });
        }

        // TODO - updating data in database
        // TODO - Disable customer name field when in edit mode
        // TODO - Display visit history
        return(
            <div className={outterClasses}>
                <div className="customer-info form-inline">
                    <div className="form-group">
                        <b>Phone:</b>
                        <input type="text" className="edit-cust-info-field form-control"
                                id="edit-cust-info-phone"
                                value={this.state.phoneNumber}
                                onChange={this.updatePhoneNumber}
                                disabled={disabled} />
                    </div>
                    <div className="form-group">
                        <b>Email:</b>
                        <input type="text" className="edit-cust-info-field form-control"
                                id="edit-cust-info-email"
                                value={this.state.emailAddress}
                                onChange={this.updateEmailAddress}
                                disabled={disabled} />
                    </div>
                    <input type="hidden" id="customer-id" value={customer.ID} />
                    <div>
                        <button id="edit-cust-info-btn"
                            className="btn_default_cb btn_edit_cust_info"
                            onClick={this.toggleEditMode}>{editButtonText}
                        </button>
                        { saveButton }
                        { closeButton }
                    </div>
                    <div>
                        { errorMessages }
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CustomerProfile;
