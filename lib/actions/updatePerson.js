"use strict";
const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

// Update all users who have the same same_contactperson
let user = {
  rowid: 180218,
  name: 'Doww'
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

    let headers = {
      'X-API-KEY': cfg.apikey
    };

    let requestOptions = {
      json: user,
      headers
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
            let response = res.content;
            console.log(`rowid: ${user.rowid} was last updated: ${response[0].last_update}`);

            return response[0].last_update;
            // for (let person of Object.keys(response)) {
            //   if (response[person].rowid == user.rowid) {
            //     console.log(`rowid: ${user.rowid} was last updated: ${response[person].last_update}`);
            //     return response[person].last_update;
            //   }
            // }
          }, (err) => {
            console.log(`ERROR: ${err}`);
          });
      });
  }
});
