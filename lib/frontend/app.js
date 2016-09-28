// This is the current entry point
var DateTime = require('./modules/dateTime');
var Fields = require('./modules/fields');
var ReactDOM = require('react-dom');
var React = require('react');
// var Scheduler = require('./modules/scheduler');

// Scheduler.init();

// NOTE JQuery gets loaded because I include it in
// the index.html before app.js.
// Can load vendor Js using CommonsChunkPlugin from webpack
// https://webpack.github.io/docs/code-splitting.html
$(document).ready(function() {
    ReactDOM.render(<Fields />, document.getElementById("fields-component"));
});
