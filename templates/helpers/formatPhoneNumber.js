module.exports = function(phoneNumber) {
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
};
