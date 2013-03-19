/**

Copyright & License

Copyright (c) 2013 ProSiebenSat.1 Digital GmbH

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

(function (factory) {
   if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
     define("JsonSchemaComponent", ['jquery'], factory);
   } else {
     // RequireJS isn't being used. Assume JsonSchemaComponent is loaded in <script> tags
     window.JsonSchemaComponent = factory(jQuery);
   }
}(function($) {


function JsonSchemaComponent(options) {

  if (options == null) {
    throw new Error("JsonSchemaComponent needs arguments, like this: 'new JsonSchemaComponent({...);'.");
  }

  if (options.schema == null) {
    throw new Error("JsonSchemaComponent needs a schema, like this: 'new JsonSchemaComponent({schema:{...});'.");
  }

  if (options.textarea == null) {
    throw new Error("JsonSchemaComponent needs a textarea, like this: 'new JsonSchemaComponent({textarea:'#...');'.");
  }

  var _this = this;
  var textarea = $(options.textarea);
  var validation_errors_formatter = options.validation_errors_formatter || function(errors) {
    return errors;
  }
  var json = $.parseJSON($(textarea).val());

  var validator;
  if (window.JSV != null) {
    validator = JSV.createEnvironment();
  }

  _this.render = function() {
    return $(options.template || _this.TEMPLATE).tmpl(options.schema);
  }

  if (options.existing_form == null) {
    var rendered = _this.render();
    var append_fn = rendered.appendPolyfillTo /* webshims support */ || rendered.appendTo;
    append_fn.call(rendered, options.form);
  }

  split_tags_by = RegExp(options.split_tags_by || /\ *,\ */);

  var form = $(options.existing_form || options.form);

  _this.setDatalist = function(field, datalist) {
    var html_fn = rendered.htmlPolyfill /* webshims support */ || rendered.html;
    html_fn.call($('#' + field + '_datalist'), "<select>" + datalist + "</select>");
  };

  _this.setValidationErrors = function(errors) {

    errors = validation_errors_formatter(errors);

    form.toggleClass("error", errors.length > 0);

    if (errors.length === 0) {
      // no errors, clear all the messages
      $.each(json, function(property) {
        form.find('#' + property + '-error').hide();
      });
      form.trigger('validates');
      return;
    }

    // There were errors, show them!
    form.trigger('errors', errors);

    $.each(errors, function(index, issue) {
      var property   = issue.uri.split('/')
                        .splice(-1)[0] /* <- "last element of array" */
      var message    = issue.message;
      if (issue.details) {
        message += " (" + issue.details + ")";
      }
      var element    = form.find('#' + property + '-error');

      if (element.length < 1) {
        var input = form.find('*[name=' + property + ']');
        $(input).before("<span id='" + property + "-error' ></span>");
        element = form.find('#' + property + '-error');
      }

      $(element).addClass("errorStr").html(message).show();
    });
  }

  _this.setValidationReport = function(report) {
     /* TODO deprecate this function */
     _this.setValidationErrors(report.errors);
  }

  function get_property_type(name) {
   if (options.schema != null &&
       options.schema.properties != null &&
       options.schema.properties[name] != null &&
       options.schema.properties[name].type != null) {
      return options.schema.properties[name].type
    }
  }

  function form_out(name, value) {
    /**
     * Changes values in an existing form's input field with name <name>
     * according to the values in <value>
     */
    var input = form.find('*[name=' + name + ']');
    var type = input.attr("type");
    var property_type = get_property_type(name);

    if(type === "checkbox" || type === "radio") {
      input.each(function(_, input) {

        var checked;

        if (property_type === "array") {
          checked = value.indexOf(input.value) !== -1;
        } else {
          checked = value === true;
        }

        if (checked) {
          $(input).attr("checked", "checked")
        } else {
          $(input).removeAttr("checked");
        }
      });
    } else {
      input.val(value);
    }
  }

  function form_in(input_type, name, value, selected) {
    /**
     * Changes the textarea's content according to an input's change event in
     * accordance with the schema.
     */

    if(options.schema != null &&
       options.schema.properties &&
       options.schema.properties[name] == null) {
      return;
    }

    var property_type = get_property_type(name);

    if(property_type === "boolean") {
      json[name] = selected;
    } else if(property_type === "integer") {
      json[name] = parseInt(value, 10);
    } else if(property_type === "number") {
      json[name] = parseFloat(value);
    } else if (property_type === "array" && input_type == "text") {
      json[name] = value.split(split_tags_by);
    } else if (property_type === "array" && input_type !== "select") {
      json[name] = json[name] || [];
      var pos = json[name].indexOf(value);
      var contains = pos !== -1;
      if (selected && !contains) {
        json[name].push(value);
      } else {
        // "delete json[name][pos]"
        json[name] = $.grep(json[name], function(_, i) {
          return i !== pos;
        })
      }
    } else {
      json[name] = value;
    }

    if (validator != null) {
      _this.setValidationErrors(validator.validate(json, options.schema).errors);
    }

    textarea.val(JSON.stringify(json, null, 2));
  };

  $.each(json, form_out);

  form.on('change', function(e) {
    var tag_name = e.target.tagName.toLowerCase();
    var target = $(e.target);
    var input_type;
    if (tag_name === "select") {
      input_type = "select";
    } else {
      input_type = target.attr("type") || "text";
    }
    var name = target.attr('name');
    var value = target.val();
    var selected = target.attr("checked") === "checked";

    form_in(input_type, name, value, selected);
  });
}

JsonSchemaComponent.prototype.TEMPLATE = [
  '<div>',
  '<h2>${name}</h2>',
  '{{each(name, properties) properties}}<p><label>',
  '  {{if properties.description}}',
  '    <b>${properties.description}</b>',
  '  {{else}}',
  '    <b>${name}</b>',
  '  {{/if}}',
  '  {{if properties.type === "time" || properties.type === "date"}}',
  '    <input name="${name}" list="${name}_datalist" type="${properties.type}"/>',
  '  {{else properties.type === "date-time"}}', // special handling to remove hyphen
  '    <input name="${name}" list="${name}_datalist" type="datetime"/>',
  '  {{else properties.type === "integer" || properties.type === "number"}}',
  '    <input name="${name}" list="${name}_datalist" type="number"/>',
  '  {{else properties.type === "boolean"}}',
  '    <input name="${name}" list="${name}_datalist" type="checkbox"/>',
  '  {{else !(!properties.items || properties.type !== "array")  }}', // can't use "&" inside jQuery.tmpl :(
  '    <select multiple=multiple name="${name}">',
  '    {{each(index, value) properties.items.enum}}',
  '      <option value="${value}">${value}</option>',
  '    {{/each}}',
  '    </select>',
  '  {{else}}', // catches properties.type === "string" and unknown cases
  '    {{if properties.enum == null}}',
  '      <input name="${name}" list="${name}_datalist" type="text"/>',
  '    {{else}}',
  '      <select name="${name}">',
  '     {{each(index, value) properties.enum}}',
  '       <option value="${value}">${value}</option>',
  '     {{/each}}',
  '    </select>',
  '  {{/if}}',
  '{{/if}}',
  '{{if properties.required === true}}<em>(required)</em>{{/if}}',
  '{{if properties.required === false}}<em>(optional)</em>{{/if}}',
  '</label></p>{{/each}}',
  '{{each(name, properties) properties}}<datalist id="${name}_datalist"></datalist>{{/each}}',
  '</div>'
].join('\n');

return JsonSchemaComponent;


}));

