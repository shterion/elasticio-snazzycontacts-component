const request = require('request-promise');

const snazzy = require('./../actions/snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

snazzy.createSession(cfg, async () => {
  let apiKey = cfg.apikey;
  let cookie = cfg.mp_cookie;
  let path = cfg.path;

  let uri = `${path}/mp_contact/json_respond/address_company/json_mainview?mp_cookie=${cookie}`;

  let requestOptions = {
    json: true,
    headers: {
      'X-API-KEY': apiKey
    }
  };

  try {
    const organizations = await request.post(uri, requestOptions);
    console.log(JSON.stringify(organizations.content, undefined, 2));
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }

  // request.post(uri, requestOptions)
  //   .then((res) => {
  //     console.log(JSON.stringify(res.content, undefined, 2));
  //   }, (err) => {
  //     if (err) {
  //       console.log(`ERROR: ${err}`);
  //     }
  //   });
});
