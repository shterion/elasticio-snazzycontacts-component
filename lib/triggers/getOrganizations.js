const request = require('request-promise');

const snazzy = require('./snazzy.js');

let cfg = {
  apikey: "acilfogux3h4xv5cilhiqskr8xo6ghhh",
  email: "syanev@wice.de",
  password: "d36adb53",
  mp_cookie: ''
};

snazzy.createSession(cfg, () => {
  let apiKey = cfg.apikey;
  let cookie = cfg.mp_cookie;
  let uri = `https://snazzycontacts.com/mp_contact/json_respond/address_company/json_mainview?mp_cookie=${cookie}`;

  let requestOptions = {
    json: true,
    headers: {
      'X-API-KEY': apiKey
    }
  };

  request.post(uri, requestOptions)
    .then((res) => {
      console.log(JSON.stringify(res.content, undefined, 2));
    }, (err) => {
      if (err) {
        console.log(`ERROR: ${err}`);
      }
    });
});
