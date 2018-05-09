"use strict";
const request = require('request-promise');
const snazzy = require('./snazzy');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

// Update an user
let user = {
  rowid: 199997,
  name: 'Maxy'
  // firstname: 'Patrik',
  // for_rowid: 199943,
  // same_contactperson: 247,
  // same_contactperson_top: 1
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    const {mp_cookie: cookie} = cfg;
    const {path} = cfg;
    let reply = {};

    const updatedUserUri = `${path}/mp_contact/json_respond/address_contactperson/json_detailview?mp_cookie=${cookie}`;

    const options = {
      uri: `${path}/mp_contact/json_respond/address_contactperson/json_update?mp_cookie=${cookie}`,
      json: user,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    request.post(options)
      .then((res) => {
        console.log(`UPDATED PERSON: ${JSON.stringify(res, undefined, 2)}`);
        reply = res;
      }, (err) => {
        console.log(`ERROR: ${err}`);
      }).then(() => {
        request.post(updatedUserUri, options)
          .then((res) => {
            // reply = res;
            let sameContactId = res.content[0].same_contactperson;
            console.log(`rowid: ${user.rowid} has same_contactperson: ${sameContactId}`);
            // console.log(reply);
            // return lastUpdate;
          }, (err) => {
            console.log(`ERROR: ${err}`);
          });
      });
  }
});
