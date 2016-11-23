(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['settingsModal'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "          <li>"
    + container.escapeExpression(((helper = (helper = helpers.Name || (depth0 != null ? depth0.Name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"Name","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div id=\"modal_wrapper_settings\" class=\"modal_wrapper\">\n  <div id=\"settings-modal\" class=\"modal-window\">\n    <div class=\"group\">\n      <h3 id=\"settings-header\">Settings</h3>\n      <a id=\"settings-close\" href=\"#\" onclick=\"closeSettings()\">Close[X]</a>\n    </div>\n\n    <div class=\"employee-lists group\">\n      <div id=\"non-unit\" class=\"employee-sections\">\n        <ul id=\"non-unit-employees\" class=\"employee-list\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.nullUnitEmployees : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n      </div>\n      <div id=\"unit\" class=\"employee-sections\">\n        <ul id=\"unit-employees\" class=\"employee-list\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.unitEmployees : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n      </div>\n    </div>\n\n    <div id=\"new-employee-section\">\n      <h4>Add Employee</h4>\n      <form id=\"new-employee-form\" onsubmit=\"return submitNewEmployee()\">\n        <fieldset class=\"form-group\">\n            <input type=\"text\" class=\"form-control new-emp-field\" id=\"new-employee-name\"\n                    name=\"name\" placeholder=\"Name\">\n        </fieldset>\n\n        <fieldset class=\"form-group\">\n            <input type=\"text\" class=\"form-control new-emp-field\" id=\"new-employee-cell\"\n                    name=\"cellphonenumber\" placeholder=\"Cell Number\">\n        </fieldset>\n\n        <input type=\"submit\" id=\"add-employee-btn\" class=\"btn btn-primary\" value=\"Add Employee\">\n      </form>\n\n      <p id=\"new-employee-error\" class=\"non-hidden-error-msg\"></p>\n    </div>\n  </div>\n</div>\n";
},"useData":true});
})();