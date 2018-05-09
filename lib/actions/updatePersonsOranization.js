const request = require('request-promise');
const snazzy = require('./snazzy');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

let user = {
  name: 'Doe',
  firstname: 'John',
  for_rowid: 200127,
  same_contactperson: 279
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    const {apikey} = cfg;
    const {mp_cookie: cookie} = cfg;
    const {path} = cfg;
    let reply = {};

    const options = {
      uri: `${path}/mp_contact/json_respond/address_contactperson/json_insert?mp_cookie=${cookie}`,
      json: user,
      headers: {
        'X-API-KEY': apikey
      }
    };

    request.post( options)
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
