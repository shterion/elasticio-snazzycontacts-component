const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

let user = {
  name: 'Hobbsyy',
  firstname: 'Jacky',
  for_rowid: 199978
}

snazzy.createSession(cfg, () => {
  let apiKey = cfg.apikey;
  let cookie = cfg.mp_cookie;
  let path = cfg.path;
  let existingRowid = 0;

  let uri = `${path}/mp_contact/json_respond/address_contactperson/json_insert?&mp_cookie=${cookie}`;
  let sameContactUri = `${path}/mp_contact/json_respond/same_contactperson/json_insert?&mp_cookie=${cookie}`;
  let updatedUserUri = `${path}/mp_contact/json_respond/address_contactperson/json_detailview?mp_cookie=${cookie}`;

  let requestOptions = {
    json: user,
    headers: {
      'X-API-KEY': apiKey
    }
  };

  function checkForExistingUser() {
    let uri = `https://snazzycontacts.com/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`;
    let requestOptions = {
      json: {
        max_hits: 100,
        print_address_data_only: 1
      },
      headers: {
        'X-API-KEY': apiKey
      }
    };

    return new Promise((resolve, reject) => {
      request.get(uri, requestOptions)
        .then((res) => {
          res.content.forEach((person) => {
            if (user.name == person.name && user.firstname == person.firstname) {
              existingRowid = person.rowid;
              console.log(`Person alredy exists ... ROWID: ${existingRowid}`);
            }
          })
          resolve(true);
        }).catch((e) => {
          reject(e);
        })
    });
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
        console.log(`sameContactId: ${sameContactId}`);
        resolve(sameContactId);
      });
    });
  }

  checkForExistingUser()
    .then((res) => {
      if (existingRowid == 0) {
        uri = `${path}/mp_contact/json_respond/address_contactperson/json_insert?&mp_cookie=${cookie}`;
        console.log('Creating a person ...');
      } else {
        user.rowid = existingRowid;
        uri = `${path}/mp_contact/json_respond/address_contactperson/json_detailview?mp_cookie=${cookie}`;
        console.log(`existingRowid: ${existingRowid}`);
        console.log('Updating a person ...');
      }
    }).then(() => {
      if (existingRowid > 0) {
        request.post(uri, requestOptions)
          .then((res) => {
            reply = res.content;
            console.log(`same_contactperson: ${res.content[0].same_contactperson}`);
          }).catch((e) => {
            console.log(`ERROR: ${e}`);
          });
      } else {
        getSameContactId()
          .then((res) => {
            user.same_contactperson = res;
            request.post(uri, requestOptions)
              .then((res) => {
                reply = res.content;
              }).catch((e) => {
                console.log(`ERROR: ${e}`);
              });
          })
      }
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });
});
