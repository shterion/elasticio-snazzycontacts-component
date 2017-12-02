"use strict";
const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

// Update an user
let user = {
  rowid: 197482,
  name: 'Dowey'
  // firstname: 'Patrik',
  // for_rowid: 199943,
  // same_contactperson: 247,
  // same_contactperson_top: 1
};


snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    let cookie = cfg.mp_cookie;
    let path = cfg.path;

    let uri = `${path}/mp_contact/json_respond/address_contactperson/json_update?mp_cookie=${cookie}`;
    let updatedUserUri = `${path}/mp_contact/json_respond/address_contactperson/json_detailview?mp_cookie=${cookie}`;

    let requestOptions = {
      json: user,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    request.post(uri, requestOptions)
      .then((res) => {
        reply = res;
        console.log(reply);
      }, (err) => {
        console.log(`ERROR: ${err}`);
      }).then(() => {
        request.post(updatedUserUri, requestOptions)
          .then((res) => {
            let lastUpdate = res.content[0].last_update;
            console.log(`rowid: ${user.rowid} was last updated: ${lastUpdate}`);

            return lastUpdate;
          }, (err) => {
            console.log(`ERROR: ${err}`);
          });
      });
  }
});
