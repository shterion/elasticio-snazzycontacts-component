const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

let user = {
  name: 'Hobbsy',
  firstname: 'Jackyy'
  // for_rowid: 199978
};

snazzy.createSession(cfg, () => {
  const {apikey} = cfg;
  const {mp_cookie: cookie} = cfg;
  const {path} = cfg;
  let existingRowid = 0;

  let uri = `${path}/mp_contact/json_respond/address_contactperson/json_insert?&mp_cookie=${cookie}`;
  const sameContactUri = `${path}/mp_contact/json_respond/same_contactperson/json_insert?&mp_cookie=${cookie}`;
  // let updatedUserUri = `${path}/mp_contact/json_respond/address_contactperson/json_detailview?mp_cookie=${cookie}`;

  const requestOptions = {
    json: user,
    headers: {
      'X-API-KEY': apikey
    }
  };

  function checkForExistingUser() {
    let requestOptions = {
      uri: `https://snazzycontacts.com/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`,
      json: true,
      headers: {
        'X-API-KEY': apikey
      }
    };

    return new Promise((resolve, reject) => {
      request.get(requestOptions)
        .then((res) => {
          res.content.forEach((person) => {
            if (user.name == person.name && user.firstname == person.firstname) {
              existingRowid = person.rowid;
              console.log(`Person already exists ... ROWID: ${existingRowid}`);
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
      const header = {
        headers: {
          'X-API-KEY': apikey
        }
      };
      request(sameContactUri, header)
        .then((res) => {
          const jsonDecode = JSON.parse(res);
          let sameContactId = jsonDecode.rowid;
          console.log(`sameContactId: ${sameContactId}`);
          resolve(sameContactId);
        }).catch((e) => {
          reject(e);
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
        uri = `${path}/mp_contact/json_respond/address_contactperson/json_update?mp_cookie=${cookie}`;
        // console.log(`existingRowid: ${existingRowid}`);
        console.log('Updating a person ...');
      }
    }).then(() => {
      if (existingRowid > 0) {
        request.post(uri, requestOptions)
          .then((res) => {
            reply = res;
            console.log(`UPDATED PERSON: ${JSON.stringify(res, undefined, 2)}`);
          }).catch((e) => {
            console.log(`ERROR: ${e}`);
          });
      } else {
        getSameContactId()
          .then((res) => {
            user.same_contactperson = res;
            request.post(uri, requestOptions)
              .then((res) => {
                reply = res;
                console.log(reply);
              }).catch((e) => {
                console.log(`ERROR: ${e}`);
              });
          })
      }
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });
});
