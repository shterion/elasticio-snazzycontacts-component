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

module.exports = {
  options,
  configOptions
}
