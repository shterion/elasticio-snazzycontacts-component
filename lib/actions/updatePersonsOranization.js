const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

let reply = {};

const cfg = config.getEnvironment();

let user = {
  name: 'Doe',
  firstname: 'John',
  for_rowid: 199943,
  same_contactperson: 279,
  // same_contactperson_top: 0
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    let apiKey = cfg.apikey;
    let cookie = cfg.mp_cookie;
    let path = cfg.path;
    let uri = `${path}/mp_contact/json_respond/address_contactperson/json_insert?mp_cookie=${cookie}`;

    let requestOptions = {
      json: user,
      headers: {
        'X-API-KEY': apiKey
      }
    };

    request.post(uri, requestOptions)
      .then((res) => {
        reply = res.content;
        console.log(res.same_contactperson);
        // console.log(JSON.stringify(res, undefined, 2));
      }, (err) => {
        console.log(`ERROR: ${err}`);
      });

    // request.get(sameContactUri, requestOptions)
    //   .then((res) => {
    //     let result = JSON.parse(res);
    //     // console.log(JSON.stringify(res, undefined, 2));
    //     console.log(result.rowid);
    //   });
  }
});
