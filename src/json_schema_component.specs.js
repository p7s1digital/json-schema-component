
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

  function json_val(input) {
    return JSON.parse($(input).val());
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
              type: "array"
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

      expect(json_val($("#testtextarea")).title).toEqual("Captain Ahab");

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

      expect(json_val("#testtextarea").abstract).toEqual("A story about a man and his whale");

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

      expect(json_val("#testtextarea").public).toEqual('yes');

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

      expect(json_val("#testtextarea").category).toEqual('local');
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
      expect(json_val("#testtextarea").eaten_by_whale).toBeFalsy();

      $('#eaten').click();
      expect(json_val("#testtextarea").eaten_by_whale).toBeTruthy();
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
              type: "array"
            }
          }
        }
      });

      $('#a').click();
      expect(json_val($("#testtextarea")).characters).toEqual(["elijah", "ahab"]);

      $('#i').click();
      expect(json_val($("#testtextarea")).characters).toEqual(["elijah", "ahab", "ishmael"]);

      $('#e').click();
      expect(json_val($("#testtextarea")).characters).toEqual(["ahab", "ishmael"]);
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
              description: "which harpooneers do you like the most ?",
              type: "array"
            }
          }
        }
      });

      select_option("#selecttest", "#t", true);
      expect(json_val($("#testtextarea")).harpooneers).toEqual(["Queequeg", "Tashtego"]);

      select_option("#selecttest", "#q", false);
      expect(json_val($("#testtextarea")).harpooneers).toEqual(["Tashtego"]);
    });

    it("should should not add fields to the data that are in the form but not in the schema (regression)", function() {

      fixture.html(
        '<textarea id=testtextarea>{"whale": "Moby Dick"}</textarea>'+
        '<form id=testform>' +
        'Managed by component: ' +
        '<input type=text id=whaletext name=whale value="" />' +
        'Managed externally, ignored by component: ' +
        '<input type=text id=captaintext name=captain value="Ahab" />' +
        '</form>'
      );

      new JsonSchemaComponent({
        textarea:"#testtextarea",
        existing_form:"#testform",
        schema: {
          properties: {
            whale: {
              type: "string"
            }
          }
        }
      });

      $("#whaletext").trigger("change")
      $("#captaintext").trigger("change")
      expect($("#testtextarea").val()).toNotContain("captain");
      expect($("#testtextarea").val()).toContain("Moby Dick");
    });
  });

  function _render_form_from_schema(schema) {
    new JsonSchemaComponent({
      textarea:"#testtextarea",
      form:"#testform",
      schema: schema
    });
    return $("#testform").html().toLowerCase();
  }

  describe('form-renderer features', function() {
    beforeEach(function () {
      fixture.html(
        '<textarea id=testtextarea>{}</textarea>'+
        '<form id=testform></form>'
      );
    });

    it("should should render a simple one-textfield-form", function() {
      var html = _render_form_from_schema({
        properties:{harpooneers:{description:"which harpooneers do you like the most ?", type:"string"}}
      });

      expect(html).toContain('which harpooneers do you like the most ?');
      expect(html).toMatch('<input name="harpooneers".*type="text">');
    });

    it("should should render a required field", function() {
      var html = _render_form_from_schema({
        properties:{terms_of_service:{descripion:"Do you accept?",required:true,type:"boolean"}}
      });

      expect(html).toContain('<em>(required)</em>');
      expect(html).toMatch('\<input name="terms_of_service".*type="checkbox"\>');
    });

    it("should should render an optional field", function() {
      var html = _render_form_from_schema({
        properties:{newsletter:{descripion:"Do you like spam?",required:false,type:"boolean"}}
      });

      expect(html).toContain('<em>(optional)</em>');
      expect(html).toMatch('<input name="newsletter".*type="checkbox">');
    });

    it("should should render a simple one-checkbox-form", function() {
      var html = _render_form_from_schema({
        properties:{harpooneers:{type:"boolean"}}
      });

      expect(html).toMatch('<input name="harpooneers".*type="checkbox">');
    });

    it("should should render a simple one-select-form", function() {
      var html = _render_form_from_schema({
        properties:{mate:{type:"string", "enum":["starbuck", "stubb", "flask"]}}
      });

      expect(html).toContain('<select name="mate">');
      expect(html).toContain('<option value="starbuck">starbuck</option>');
      expect(html).toContain('<option value="stubb">stubb</option>');
      expect(html).toContain('<option value="flask">flask</option>');
      expect(html).toContain('</select>');
    });

    it("should should render a simple multi-select-form", function() {
      var html = _render_form_from_schema({
        properties:{crosswords:{type:"array",items:{"enum":["m", "o", "b", "y", "d", "i", "c", "k"]}}}
      });

      expect(html).toContain('<select multiple="multiple" name="crosswords">');
      expect(html).toContain('<option value="m">m</option>');
      expect(html).toContain('<option value="d">d</option>');
      expect(html).toContain('</select>');
    });

    it("should render plain input boxes for unknown types", function() {
      var html = _render_form_from_schema({
        properties:{white_whale_dna_sample:{type:"dna-sequence"}}
      });
      expect($("#testform").html().toLowerCase()).toContain('<input name="white_whale_dna_sample"');
    });

    it("should should render the custom specified template", function() {
      new JsonSchemaComponent({
        textarea: "#testtextarea",
        form: "#testform",
        template: "<div><b>custom template</b></div>",
        schema: {}
      });
      expect($("#testform").html().toLowerCase()).toEqual("<b>custom template</b>");
    });

  });

  describe('validation features', function() {
    beforeEach(function () {
      fixture.html(
        '<textarea id=testtextarea>{}</textarea>'+
        '<form id=testform></form>'
      );
    });

    describe('html and css', function() {
      it('should give the form the css class error when the form does not validate', function() {
        _render_form_from_schema({
          properties:{title:{type:"string",pattern: "^Moby"}}
        });

        $("#testform").find("input").val("Not moby dick").trigger("change")

        expect($("#testform").attr("class")).toEqual("error");
      });

      it('should give clear the css class error when the form validates again', function() {
        _render_form_from_schema({
          properties:{title:{type:"string",pattern: "^Moby"}}
        });

        $("#testform").find("input").val("Not moby dick").trigger("change")
        $("#testform").find("input").val("Moby dick").trigger("change")

        expect($("#testform").attr("class")).toNotContain("error");
      });

      it('should display the error in a custom field', function() {

        _render_form_from_schema({
          properties:{title:{type:"string",pattern: "^Moby"}}
        });
        $("#testform").append("<h1 id=title-error>Errors here!</h1>")

        $("#testform").find("input").val("Not moby dick").trigger("change")

        expect($("#title-error").html()).toContain("String does not match pattern");
        expect($("#title-error").html()).toContain("^Moby");
        expect($("#title-error").attr("class")).toContain("errorStr");
      });

      it('should create an error field if none is found', function() {

        _render_form_from_schema({
          properties:{title:{type:"string",pattern: "^Moby"}}
        });

        $("#testform").find("input").val("Not moby dick").trigger("change")

        expect($("#title-error").html()).toContain("String does not match pattern");
        expect($("#title-error").html()).toContain("^Moby");
      });
    });

    describe('events', function() {

      it('should have the form fire an errors event if the form fails to validate', function() {

        _render_form_from_schema({
          properties:{title:{type:"string",pattern: "^Moby"}}
        });

        var fired = false;
        $("#testform").on("errors", function() {
          fired = true;
        });
        $("#testform").find("input").val("Not moby dick").trigger("change")

        expect(fired).toBeTruthy()
      });

      it('should have the form fire an validates event if the form  validates again', function() {

        _render_form_from_schema({
          properties:{title:{type:"string",pattern: "^Moby"}}
        });

        var validates = false;
        $("#testform").on("validates", function() {
          validates = true;
        });

        $("#testform").find("input").val("Not moby dick").trigger("change");
        expect(validates).toBeFalsy()

        $("#testform").find("input").val("Moby dick").trigger("change");
        expect(validates).toBeTruthy()

      });
    });

    describe('external', function() {

      it('should display external validation', function() {

        var mycomponent = new JsonSchemaComponent({
          textarea:"#testtextarea",
          form:"#testform",
          schema: {
            properties:{title:{type:"string"}}
          }
        });
        var backend_error_report = {
          errors: [{
            message : "But what's this long face about, Mr. Starbuck;",
            details : "wilt thou not chase the white whale!",
            uri     : "/title",
          }]
        };

        mycomponent.setValidationReport(backend_error_report);

        expect($("#title-error").html()).toContain("Mr. Starbuck")
        expect($("#title-error").html()).toContain("white whale")
      });
    });
  })
});

