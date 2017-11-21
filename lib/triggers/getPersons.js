const request = require('request-promise');

const snazzy = require('./../actions/snazzy.js');
const config = require('./../../config/config');

let cfg = {
  apikey: config.production.apikey,
  email: config.production.email,
  password: config.production.password,
  mp_cookie: ''
};

snazzy.createSession(cfg, () => {
  let apiKey = cfg.apikey;
  let cookie = cfg.mp_cookie;
  let uri = `https://snazzycontacts.com/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`;
  // let uri = `http://localhost/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`;

  let requestOptions = {
    json: {
      max_hits: 100,
      print_address_data_only: 1
    },
    headers: {
      'X-API-KEY': apiKey
    }
  };

  request.post(uri, requestOptions)
    .then((res) => {
        let result = res.content;
        // let filtered = result.filter(({name}) => name === '279');
        // console.log(filtered);

        console.log(JSON.stringify(result, undefined, 2));

      // console.log(JSON.stringify(res.content, undefined, 2));
    }, (err) => {
      if (err) {
        console.log(`ERROR: ${err}`);
      }
    });
});
