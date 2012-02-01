===================
JsonSchemaComponent
===================

This JavaScript library will

- **generate a form** from a given `JSON Schema <http://json-schema.org/>`_,
- **fill (that) form** with a JSON data structure contained in a (hidden) textarea,
- **sync changes** to the form to the data structure, and

The combination of these features allows for the rapid development of instant
user interfaces for JSON APIs, e.g. in CouchDB powered back office GUIs.

You can view a demo at
https://peritus.s3.amazonaws.com/json_schema_component/demo.html

Usage
=====

Here is a simple example showing how to embed this library in your web
application::

  <!-- .. -->
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js">
  <script src="http://ajax.aspnetcdn.com/ajax/jquery.templates/beta1/jquery.tmpl.min.js">
  <script src="path/to/json_schema_component.js">
  <script>
  new JsonSchemaComponent({
    schema: {
      properties: {
        eaten_by_whale: {
          description: "Has this thing been eaten by a whale ?",
          type: "boolean"
        }
      }
    },
    textarea: $('#mytextarea'),
    form: $('#myform')
  });
  $('#mytextarea').hide()
  </script>
  </body>
  </html>

You need to include `jQuery <http://jquery.com/>`_ (tested with 1.7.1) and
`jQuery.tmpl <https://github.com/jquery/jquery-tmpl>`_ before including
``json_schema_component.js``. If you also want to support browsers without
native JSON support, you need to include Douglas Crockford's `json2.js
<https://github.com/douglascrockford/JSON-js>`_.

Properties
++++++++++

This is a complete list of the properties ``new JsonSchemaComponent({/*
properties here*/});`` accepts:

**schema** <object> (required)
  JavaScript object containing the JSON Schema that is used to generate the
  form.

**textarea** <selector or jQuery> (required)
  The textarea containing the JSON data structure that is kept in sync with the
  form. The value of the textarea must be valid JSON.

**form** <selector or jQuery> (required if **existing_form** not specified)
  The DOM node where the form should be generated.

**existing_form** <selector or jQuery> (required if **form** not specified)
  If you want to render the form on the server side (or client-side before
  invoking JsonSchemaComponent) you can specify a form that is already in the
  DOM. JsonSchemaComponent will then only attach event handlers to update it.

**template** <string> (optional)
  The jquery.tmpl template used to generate the form using the schema. The
  default template will be used if omitted.

Note
++++

Although this library performs some basic validation, you need to apply some
validation on the server side before saving the user-provided data to your
database for security reasons.

Development
===========

To hack on this library itself (not for using this as part of your web
application), you need to clone the source code repository from GitHub like
this::

  git clone https://github.com/p7s1digital/json-schema-component.git
  cd json-schema-component

Tests
+++++

Testing this library is done using `Jasmine BDD
<http://pivotal.github.com/jasmine/>`_. You can find the test suite in
``src/json_schema_component.specs.js`` and execute the tests in your browser at
https://peritus.s3.amazonaws.com/json_schema_component/tests.html.

At the moment we know the tests work in Google Chrome, Safari, Firefox 9 and
Internet Explorer 9.

Defects and feature requests
++++++++++++++++++++++++++++

We use GitHub Issues to track defects and feature requests at
https://github.com/p7s1digital/json-schema-component/issues. To demonstrate a
certain behavior, you can link to the `demo page
<https://peritus.s3.amazonaws.com/json_schema_component/demo.html>`_ (the state
of the input values is persisted in the hash part ("``#preset=``") of the url).
Please use an `URL shortening service <http://tinyurl.com>`_ when posting such
URLs to the issue tracker.

This library does not (yet) support the complete JSON Schema specification.
Pull requests containing tests are welcome!

Changelog
=========

v0.1 - 2012-01-03
 - initial, non-public release

Legal
=====

**Authors**
  Filip Noetzel <http://filipnoetzel.com/>

**License**
  TBD

**Copyright**
  |copy| 2012 by ProSiebenSat.1 Digital GmbH, Medienallee 6, 85774 Unterföhring

.. |copy|   unicode:: U+000A9 .. COPYRIGHT SIGN

