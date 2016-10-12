// This is the current entry point
var CustomerSearch = require('./modules/customer/customerSearch');
var React = require('react');
var ReactDOM = require('react-dom');

// Scheduler.init();

// NOTE JQuery gets loaded because I include it in
// the index.html before app.js.
// Can load vendor Js using CommonsChunkPlugin from webpack
// https://webpack.github.io/docs/code-splitting.html
$(document).ready(function() {
    ReactDOM.render(<CustomerSearch />, document.getElementById("customer-search-component"));
});
