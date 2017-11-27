"use strict";
const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

// Update an organization
let organization = {
  rowid: 194414,
  name: 'Random GmbH'
};


snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    let cookie = cfg.mp_cookie;
    let path = cfg.path;

    let uri = `${path}/mp_contact/json_respond/address_company/json_update?mp_cookie=${cookie}`;
    let updatedUserUri = `${path}/mp_contact/json_respond/address_company/json_detailview?mp_cookie=${cookie}`;

    let requestOptions = {
      json: organization,
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
            let response = res.content;
            console.log(response);
            // console.log(`rowid: ${organization.rowid} was last updated: ${response[0].last_update}`);

            // return response[0].last_update;
          }, (err) => {
            console.log(`ERROR: ${err}`);
          });
      });
  }
});
