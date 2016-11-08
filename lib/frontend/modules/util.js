var Util = {
    /*
    This adds dashes to the phone number.
    Phone numbers in the database are stored
    without dashes, so when a number is displayed on front-end,
    its easier to read with dashes.
    NOTE length could either be 7 or 10 digits
    5896415 => 589-6415
    6315891234 => 631-589-1234
    */
    formatPhoneNumber: function(phoneNumber) {
        if (!phoneNumber) {
            return phoneNumber;
        }

        // Take the first 3 numbers, then next 3, regardless of length
        var ret = phoneNumber.substr(0, 3) + "-" + phoneNumber.substr(3, 3);

        // Append the last digit to ret if length is 10
        if (phoneNumber.length === 7) {
            ret += phoneNumber.slice(-1);
        }
        else if (phoneNumber.length === 10) {
            ret += "-" + phoneNumber.substr(6);
        }

        return ret;
    },

    // Does the opposite of formatPhoneNumber
    // Remove dashes, spaces, and ( ) from a phoneNumber
    // User may have entered phone number 631 589 6415 or 589-6415
    // NOTE this replaces ALL spaces, ALL ()'s, and ALL dashes (631----1234 ==> 6311234)
    stripPhoneNumber: function(number) {
        return number.replace(/[\s\-()]/g, "");
    },

    // Validates phone number after being stripped of dashes
    validatePhoneNumber: function(number) {
        var ret = {
            valid: true,
            errorMessages: []
        };

        // User may erase phone number
        if (number.length === 0) {
            return ret;
        }

        // Strip the number first before validating it
        var stripped = this.stripPhoneNumber(number),
            // Regex to be 7 OR 10 digits
            numberRegEx = /^(\d{7}|\d{10})$/;

        if (stripped.length === 7 || stripped.length === 10) {
            if (!numberRegEx.test(stripped)) {
                ret.valid = false;
                ret.errorMessages.push("Please enter a valid phone number");
            }
        }
        else {
            ret.valid = false;
            ret.errorMessages.push("Please enter a valid phone number");
        }

        return ret;
    },

    validateEmailAddress: function(emailAddress) {
        var dotIndex,
            atSymbolIndex,
            host,
            domain,
            address,
            ret = {
                valid: true,
                errorMessages: []
            };

        // If no email address, not invalid
        if (emailAddress.length === 0) {
            return ret;
        }

        dotIndex = emailAddress.lastIndexOf(".");
        atSymbolIndex = emailAddress.indexOf("@");
        if ( (dotIndex === -1) || (atSymbolIndex === -1) ) {
            // No "." or "@"
            ret.valid = false;
            ret.errorMessages.push("Please enter a valid email");
        }
        else if (dotIndex < atSymbolIndex) {
            // If "@" comes after the last ".", then invalid
            // christian.bonacore@gmail.com
            ret.valid = false;
            ret.errorMessages.push("Please enter a valid email");
        }
        else {
            // User could enter just "@."
            // Make sure there is text between the symbols
            // christian@gmail.com
            host = emailAddress.substring(0, atSymbolIndex);
            domain = emailAddress.substring((atSymbolIndex + 1), dotIndex);
            address = emailAddress.substring((dotIndex + 1));

            if ((host.length === 0) || (domain.length === 0) || (address.length === 0)) {
                ret.valid = false;
                ret.errorMessages.push("Please enter a valid email");
            }
        }

        return ret;

    }
};

module.exports = Util;
