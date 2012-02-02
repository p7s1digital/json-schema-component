JsonSchemaComponent.prototype.TEMPLATE = (
  '<div>' +
  '<h2>${name}</h2>' +
  '{{each(name, properties) properties}}<p><label>' +
    '{{if properties.description}}<b>${properties.description}</b>{{/if}}' +
    '{{if properties.type === "boolean"}}' +
      '<input name="${name}" type="checkbox"/>' +
    '{{else properties.type === "array"}}' +
      '<select multiple=multiple name="${name}">' +
      '{{each(index, value) properties.items.enum}}' +
        '<option value="${value}">${value}</option>' +
      '{{/each}}' +
      '</select>' +
    '{{else}}'+ // catches properties.type === "string" and unknown cases
      '{{if properties.enum == null}}'+
        '<input name="${name}" type="text"/>' +
      '{{else}}' +
        '<select name="${name}">' +
        '{{each(index, value) properties.enum}}' +
          '<option value="${value}">${value}</option>' +
        '{{/each}}' +
        '</select>' +
      '{{/if}}' +
    '{{/if}}' +
    '{{if properties.required === true}}<em>(required)</em>{{/if}}' +
    '{{if properties.required === false}}<em>(optional)</em>{{/if}}' +
  '</label></p>{{/each}}' +
  '</div>'
);

