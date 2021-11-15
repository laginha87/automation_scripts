const fs = require('fs');
const Ajv = require('ajv');

const ajv = new Ajv({ strict: false });

const schema = JSON.parse(fs.readFileSync('./schema.jsonschema', 'utf8'));

const data = JSON.parse(fs.readFileSync('./actions_j.json', 'utf8'));

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
    console.log(validate.errors);
}
