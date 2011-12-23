
var fixture;

beforeEach(function () {
  fixture = $("#fixture");
  fixture.empty();
});

describe("JsonSchemaComponent", function() {

  function select_option(select_element, option_element, selected) {
    /*
    * Helper method to simulate a click on an <option> element inside a <select>.
    */
    if (selected) {
      $(option_element).attr("selected", "selected");
    } else {
      $(option_element).removeAttr("selected");
    }

    $(select_element).trigger(
      $.Event("change", {
        target: $(select_element).get(0)
      })
    );
  }

  describe('form-in features', function() {

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

      new JsonSchemaComponent({schema:{}, textarea:"#testtextarea", existing_form:"#testform"});

      expect($("#testtextfield").val()).toEqual("value_a");
    });

    it("should should fill boolean values in a provided form with two checkboxes", function() {
      fixture.html('<textarea id=testtextarea>{"field_a": true, "field_b": false}</textarea>'+
                   '<form id=testform>'+
                   '<input type=checkbox id="testcheckbox_a" name=field_a />'+
                   '<input type=checkbox id="testcheckbox_b" name=field_b />'+
                   '</form>');

      new JsonSchemaComponent({schema:{}, textarea:"#testtextarea", existing_form:"#testform"});

      expect($("#testcheckbox_a").is(":checked")).toBeTruthy();
      expect($("#testcheckbox_b").is(":checked")).toBeFalsy();
    });

    it("should should update multiple radio from an array field", function() {
      fixture.html('<textarea id=testtextarea>{"field": ["b"]}</textarea>'+
                   '<form id=testform>'+
                   '<input type=radio id="testradiobox_a" name=field value="a" />'+
                   '<input type=radio id="testradiobox_b" name=field value="b" />'+
                   '</form>');

      new JsonSchemaComponent({
        schema: {properties:{field:{type:"array"}}},
        textarea:"#testtextarea",
        existing_form:"#testform"
      });

      expect($("#testradiobox_a").is(":checked")).toBeFalsy();
      expect($("#testradiobox_b").is(":checked")).toBeTruthy();
    });

    it("should should update multiple checkboxes from an array field ", function() {
      fixture.html(
        '<textarea id=testtextarea>{"characters": ["elijah"]}</textarea>'+
        '<form id=testform>' +
          '<input type="checkbox" id=i name=characters value=ishmael />' +
          '<input type="checkbox" id=e name=characters value=elijah />' +
          '<input type="checkbox" id=a name=characters value=ahab />' +
        '</form>'
      );

      new JsonSchemaComponent({
        textarea:"#testtextarea",
        existing_form:"#testform",
        schema: {
          properties: {
            characters: {
              description: "Your favorite characters from Moby Dick",
              type: "array",
            }
          }
        }
      });

      expect($("#e").is(":checked")).toBeTruthy();

      expect($("#i").is(":checked")).toBeFalsy();
      expect($("#a").is(":checked")).toBeFalsy();
    });
  });

  describe('form-out features', function() {
    beforeEach(function () {
      fixture.html(
      );
    });

    it("should should update the textarea's json from a simple textfield change", function() {
      fixture.html(
        '<textarea id=testtextarea>{      "title": "Moby Dick"}</textarea>' +
        '<form id=testform>'+
        '<input type=text id=testtext name=title value="" />'+
        '</form>'
      );

      new JsonSchemaComponent({schema:{}, textarea:"#testtextarea", existing_form:"#testform"});

      $('#testtext').val("Captain Ahab");
      $('#testtext').trigger("change");

      expect($("#testtextarea").val()).toContain('"title": "Captain Ahab"');

    });

    it("should should update the textarea's json from a simple textarea change", function() {

      fixture.html(
        '<textarea id=testtextarea>{      "abstract": "Something about a white whale and a man.."}</textarea>' +
        '<form id=testform>'+
        '<textarea id=testtext name=abstract value="" />'+
        '</form>'
      );

      new JsonSchemaComponent({schema:{}, textarea:"#testtextarea", existing_form:"#testform"});

      $('#testtext').val("A story about a man and his whale");
      $('#testtext').trigger("change");

      expect($("#testtextarea").val()).toContain('"abstract": "A story about a man and his whale"');

    });

    it("should should update the textarea's json from a simple checkbox change", function() {

      fixture.html(
        '<textarea id=testtextarea>{      "public": "no"}</textarea>' +
        '<form id=testform>' +
        '<input type=checkbox id=testcheckbox name=public value=yes>' +
        '</form>'
      );

      new JsonSchemaComponent({schema:{}, textarea:"#testtextarea", existing_form:"#testform"});

      $('#testcheckbox').click();

      expect($("#testtextarea").val()).toContain('"public": "yes"');

    });

    it("should should update the textarea's json from a radio box", function() {

      fixture.html(
        '<textarea id=testtextarea>{      "category": "politics"}</textarea>'+
        '<form id=testform>' +
          '<input type="radio" id=l value=local name=category>' +
          '<input type="radio" id=f value=filmcritics name=category checked=checked>' +
          '<input type="radio" id=p value=politics name=category>' +
        '</form>'
      );

      new JsonSchemaComponent({schema:{}, textarea:"#testtextarea", existing_form:"#testform"});

      $('#l').click();

      expect($("#testtextarea").val()).toContain('"category": "local"');
    });

    it("should should update a boolean field from a check box", function() {
      fixture.html(
        '<textarea id=testtextarea>{"eaten_by_whale": true}</textarea>'+
        '<form id=testform>' +
          '<input type="checkbox" id=eaten name=eaten_by_whale value=ahab checked=checked/>' +
        '</form>'
      );

      new JsonSchemaComponent({
        textarea:"#testtextarea",
        existing_form:"#testform",
        schema: {
          properties: {
            eaten_by_whale: {
              description: "Has this thing been eaten by a whale ?",
              type: "boolean"
            }
          }
        }
      });

      $('#eaten').click();
      expect($("#testtextarea").val()).toContain('"eaten_by_whale": false');

      $('#eaten').click();
      expect($("#testtextarea").val()).toContain('"eaten_by_whale": true');
    });

    it("should should update an array field from a check box", function() {
      fixture.html(
        '<textarea id=testtextarea>{"characters": ["elijah"]}</textarea>'+
        '<form id=testform>' +
          '<input type="checkbox" id=i name=characters value=ishmael />' +
          '<input type="checkbox" id=e name=characters value=elijah checked=checked />' +
          '<input type="checkbox" id=a name=characters value=ahab />' +
        '</form>'
      );

      new JsonSchemaComponent({
        textarea:"#testtextarea",
        existing_form:"#testform",
        schema: {
          properties: {
            characters: {
              description: "Your favorite characters from Moby Dick",
              type: "array",
            }
          }
        }
      });

      $('#a').click();
      expect(JSON.parse($("#testtextarea").val()).characters).toEqual(["elijah", "ahab"]);

      $('#i').click();
      expect(JSON.parse($("#testtextarea").val()).characters).toEqual(["elijah", "ahab", "ishmael"]);

      $('#e').click();
      expect(JSON.parse($("#testtextarea").val()).characters).toEqual(["ahab", "ishmael"]);
    });

    it("should should update an array field from a select element", function() {
      fixture.html(
        '<textarea id=testtextarea>{"harpooneers": ["Queequeg"]}</textarea>'+
        '<form id=testform>' +
        '<select id=selecttest name=harpooneers size=5 multiple>' +
          '<option value=Queequeg id=q>Queequeg</option>' +
          '<option value=Tashtego id=t>Tashtego</option>' +
          '<option value=Daggoo id=d>Daggoo</option>' +
          '<option value=Fedallah id=f>Fedallah</option>' +
        '</select>' +
        '</form>'
      );

      new JsonSchemaComponent({
        textarea:"#testtextarea",
        existing_form:"#testform",
        schema: {
          properties: {
            harpooneers: {
              description: "Which Harpooneers do you like the most ?",
              type: "array",
            }
          }
        }
      });

      select_option("#selecttest", "#t", true);
      expect(JSON.parse($("#testtextarea").val()).harpooneers).toEqual(["Queequeg", "Tashtego"]);

      select_option("#selecttest", "#q", false);
      expect(JSON.parse($("#testtextarea").val()).harpooneers).toEqual(["Tashtego"]);
    });
  });
});

