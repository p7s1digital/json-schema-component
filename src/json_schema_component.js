
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

  var textarea = $(options.textarea);
  var json = $.parseJSON($(textarea).val());
  var form = $(options.form);

  function check(input, checked) {
    if (checked) {
      input.attr("checked", "checked")
    } else {
      input.removeAttr("checked");
    }
  }

  $.each(json, function(key, value) {
    var input = form.find('*[name=' + key + ']')
    var type = input.attr("type");

    if(type === "checkbox") {
      check(input, value === true);
    } else if (type === "radio") {
      input.each(function(_, radio_box) {
        check($(radio_box), value.indexOf(radio_box.value) !== -1);
      });
    } else {
      input.val(value);
    }
  });

  form.on('change', function(e) {
    var target = $(e.target)
    var input_type = target.attr("type");
    var name = e.target.name;
    var value = target.val();
    var selected = target.attr("checked") === "checked";

    var property_type = (
      options.schema != null &&
      options.schema.properties != null &&
      options.schema.properties[name] != null &&
      options.schema.properties[name].type
    )

    if(property_type === "boolean") {
      json[name] = selected;
    } else if (property_type === "array") {
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
  });
}

