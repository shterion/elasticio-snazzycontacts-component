const request = require('request-promise');

const snazzy = require('./snazzy.js');

let cfg = {
  apikey: "acilfogux3h4xv5cilhiqskr8xo6ghhh",
  email: "syanev@wice.de",
  password: "qwerty1234",
  mp_cookie: ''
};

let user = {
  name: 'Gibs',
  firstname: 'Oliver',
  for_rowid: 199970, // 199970, 199943, 199967
  // same_contactperson_top: 1
};

snazzy.createSession(cfg, () => {
  let apiKey = cfg.apikey;
  let cookie = cfg.mp_cookie;

  let uri = `https://snazzycontacts.com/mp_contact/json_respond/address_contactperson/json_insert?&mp_cookie=${cookie}`;
  let sameContactUri = `https://snazzycontacts.com/mp_contact/json_respond/same_contactperson/json_insert?&mp_cookie=${cookie}`;

  let requestOptions = {
    json: user,
    headers: {
      'X-API-KEY': apiKey
    }
  };

  function getSameContactId() {
    return new Promise((resolve, reject) => {
      request(sameContactUri, {
        headers: {
          'X-API-KEY': apiKey
        }
      }, (err, res, body) => {
        if (err) {
          reject(err);
          return;
        }

        let jsonDecode = JSON.parse(body);
        let sameContactId = jsonDecode.rowid;
        resolve(sameContactId);
        // console.log(`sameContactId: ${sameContactId}`);
      });
    });
  }

  (function() {
    getSameContactId()
      .then((res) => {
        user.same_contactperson = res;
        console.log(`same_contactperson: ${user.same_contactperson}`);
        request.post(uri, requestOptions)
          .then((res) => {
            reply = res.content;
            // console.log(JSON.stringify(res, undefined, 2));
          }, (err) => {
            console.log(`ERROR: ${err}`);
          });
      })
      .catch((e) => {
        console.log(`ERROR: ${e}`);
      });
  }());

  // request.post(uri, requestOptions)
  //   .then((res) => {
  //     console.log(JSON.stringify(res, undefined, 2));
  //   }, (err) => {
  //     if (err) {
  //       console.log(`ERROR: ${err}`);
  //     }
  //   });
});
