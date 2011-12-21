
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

  var json = $.parseJSON($(options.textarea).val());
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


}

