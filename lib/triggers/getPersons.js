const request = require('request-promise');

const snazzy = require('./../actions/snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

snazzy.createSession(cfg, async () => {
  const {apikey: apiKey} = cfg;
  const {mp_cookie: cookie} = cfg;
  const {path} = cfg;
  // let persons = [];

  const options = {
    uri: `${path}/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`,
    json: true,
    headers: {
      'X-API-KEY': apiKey
    }
  };

  try {
    const persons = await request.post(options);
    console.log(persons.content[0].for_rowid);
    // console.log(JSON.stringify(persons.content, undefined, 2));
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }
});
