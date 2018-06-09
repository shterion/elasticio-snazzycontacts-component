const config = require('./../../config/config');
const cfg = config.getEnvironment();

const options = {
  json: {
    'max_hits': 100
  },
  headers: {
    'X-API-KEY': cfg.apikey
  }
};

const configOptions = {
  apikey: cfg.apikey,
  email: cfg.email,
  password: cfg.password,
  path: cfg.path
};

const organizations = [{
    name: 'Company Ltd.'
  },
  {
    name: 'Test GmbH'
  },
  {
    name: 'Travel Mates'
  }
];

const persons = [{
    name: 'Test 1',
    firstname: 'Test 1'
  },
  {
    name: 'Doe',
    firstname: 'John'
  },
  {
    name: 'Smith',
    firstname: 'Mark'
  },
];

module.exports = {
  options,
  configOptions,
  persons,
  organizations
}
