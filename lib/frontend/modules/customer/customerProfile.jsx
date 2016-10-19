var React = require('react');
var Util = require('../util');

var CustomerProfile = React.createClass({

    // When the profile is in edit mode,
    // the user can update information on the employee
    getInitialState: function() {
        return ({
            editMode: false
        });
    },

    // Toggle between edit/non-edit mode
    toggleEditMode: function() {
        var current = this.state.editMode;
        this.setState({
            editMode: !current
        });
    },

    render: function() {
        var customer = this.props.customer,
            disabled,
            saveButton;

        if (!this.state.editMode) {
            disabled = "true";
        }
        else if (this.state.editMode) {
            saveButton = <button>Save</button>;
        }

        // TODO - make Edit and Close links buttons instead
        return(
            <div className="customer-history">
                <div className="customer-info form-inline">
                    <div className="form-group">
                        <b>Phone:</b>
                        <input type="text" className="edit-cust-info-field form-control"
                                id="edit-cust-info-phone"
                                value={Util.formatPhoneNumber(customer.CellPhoneNumber)}
                                disabled={disabled} />
                    </div>
                    <div className="form-group">
                        <b>Email:</b>
                        <input type="text" className="edit-cust-info-field form-control"
                                id="edit-cust-info-email"
                                value={customer.EmailAddress}
                                disabled={disabled} />
                    </div>
                    <input type="hidden" id="customer-id" value={customer.id} />
                </div>
                <span>
                    <a id="edit-cust-info-btn" onClick={this.toggleEditMode}><b>Edit Info</b></a>
                    { saveButton }
                    <a id="cust-history-close" onClick={this.props.closeResults}><b>Close[x]</b></a>
                </span>
            </div>
        );
    }
});

module.exports = CustomerProfile;
