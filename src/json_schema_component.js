
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
    var type = target.attr("type");

    if(type === "checkbox") {
      json[e.target.name] = target.attr("checked") === "checked";
    } else {
      json[e.target.name] = target.val()
    }

    textarea.val(JSON.stringify(json, null, 2));
  });
}

