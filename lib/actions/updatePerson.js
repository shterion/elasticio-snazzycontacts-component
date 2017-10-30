const request = require('request-promise');

const snazzy = require('./snazzy.js');

let reply = {};

let cfg = {
  apikey: "acilfogux3h4xv5cilhiqskr8xo6ghhh",
  email: "syanev@wice.de",
  password: "qwerty1234",
  mp_cookie: ''
};

let user = {
  // rowid: 197339,
  name: 'Jonson',
  firstname: 'Patrik',
  for_rowid: 199967,
  same_contactperson: 246,
  same_contactperson_top: 1
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    let apiKey = cfg.apikey;
    let cookie = cfg.mp_cookie;
    let uri = `https://snazzycontacts.com/mp_contact/json_respond/address_contactperson/json_insert?mp_cookie=${cookie}`;

    let requestOptions = {
      json: user,
      headers: {
        'X-API-KEY': apiKey
      }
    };

    request.post(uri, requestOptions)
      .then((res) => {
        reply = res.content;
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
