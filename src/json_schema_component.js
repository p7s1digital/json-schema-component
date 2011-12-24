
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
  var json = $.parseJSON($(textarea).val());

  _this.render = function() {
    return $(options.template || _this.TEMPLATE).tmpl(options.schema);
  }

  var form = $(options.existing_form || _this.render().appendTo(options.form));

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

    var property_type = get_property_type(name);

    if(property_type === "boolean") {
      json[name] = selected;
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

