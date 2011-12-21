
var fixture;

beforeEach(function () {
  fixture = $("#fixture");
  fixture.empty();
});

describe("JsonSchemaComponent", function() {

  it("should throw an error when invoked w/o arguments", function() {
    try {
      new JsonSchemaComponent();
    } catch (error) {
      expect(error.message).toEqual(
        "JsonSchemaComponent needs arguments, like this: 'new JsonSchemaComponent({...);'.");
    }
  });

  it("should throw an error when invoked w/o schema", function() {
    try {
      new JsonSchemaComponent({textarea:"bar"});
    } catch (error) {
      expect(error.message).toEqual(
        "JsonSchemaComponent needs a schema, like this: 'new JsonSchemaComponent({schema:{...});'.");
    }
  });

  it("should throw an error when invoked w/o textarea", function() {
    try {
      new JsonSchemaComponent({schema:{}});
    } catch (error) {
      expect(error.message).toEqual(
        "JsonSchemaComponent needs a textarea, like this: 'new JsonSchemaComponent({textarea:'#...');'.");
    }
  });

  it("should should fill values in a simple provided form with one text field", function() {
    fixture.html('<textarea id=testtextarea>{"field_a":"value_a"}</textarea>'+
                 '<form id=testform><input type=text id="testtextfield" name=field_a /></form>');

    new JsonSchemaComponent({schema:{}, textarea:"#testtextarea", form:"#testform"});

    expect($("#testtextfield").val()).toEqual("value_a");
  });

  it("should should fill boolean values in a provided form with two checkboxes", function() {
    fixture.html('<textarea id=testtextarea>{"field_a": true, "field_b": false}</textarea>'+
                 '<form id=testform>'+
                 '<input type=checkbox id="testcheckbox_a" name=field_a />'+
                 '<input type=checkbox id="testcheckbox_b" name=field_b />'+
                 '</form>');

    new JsonSchemaComponent({schema:{}, textarea:"#testtextarea", form:"#testform"});

    expect($("#testcheckbox_a").is(":checked")).toBeTruthy();
    expect($("#testcheckbox_b").is(":checked")).toBeFalsy();
  });

  it("should should fill boolean values in a provided form with two radio boxes", function() {
    fixture.html('<textarea id=testtextarea>{"field": ["b"]}</textarea>'+
                 '<form id=testform>'+
                 '<input type=radio id="testradiobox_a" name=field value="a" />'+
                 '<input type=radio id="testradiobox_b" name=field value="b" />'+
                 '</form>');

    new JsonSchemaComponent({schema:{}, textarea:"#testtextarea", form:"#testform"});

    expect($("#testradiobox_a").is(":checked")).toBeFalsy();
    expect($("#testradiobox_b").is(":checked")).toBeTruthy();
  });

});

