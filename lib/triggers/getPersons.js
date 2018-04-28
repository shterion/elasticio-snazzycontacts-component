const request = require('request-promise');

const snazzy = require('./../actions/snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

snazzy.createSession(cfg, async () => {
  let apiKey = cfg.apikey;
  let cookie = cfg.mp_cookie;
  let path = cfg.path;
  // let persons = [];

  let uri = `${path}/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`;
  let requestOptions = {
    json: {
      max_hits: 100,
      print_address_data_only: 1
    },
    headers: {
      'X-API-KEY': apiKey
    }
  };

  try {
    const persons = await request.post(uri, requestOptions);
    console.log(persons.content.length);
    // console.log(JSON.stringify(persons.content, undefined, 2));
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }

  // return new Promise((resolve, reject) => {
  //   request.post(uri, requestOptions, (err, res, body) => {
  //     if (err) {
  //       reject(err);
  //       return;
  //     }
  //     let jsonDecode = JSON.stringify(body.content, undefined, 2);
  //     resolve(console.log(jsonDecode));
  //   });
  // });

  // request.post(uri, requestOptions)
  //   .then((res) => {
  //       const result = res.content;
  //       console.log(result.length);
  //       // console.log(JSON.stringify(result, undefined, 2));
  //   }).catch((e) => {
  //     console.log(`ERROR: ${e}`);
  //   });
});
