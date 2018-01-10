"use strict";
const request = require('request-promise');
const moment = require('moment');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

// Update an organization
let organization = {
  rowid: 199978,
  name: 'Test WICE GmbH'
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    let cookie = cfg.mp_cookie;
    let path = cfg.path;

    let uri = `${path}/mp_contact/json_respond/address_company/json_update?mp_cookie=${cookie}`;
    let updatedOrganisationUri = `${path}/mp_contact/json_respond/address_company/json_detailview?mp_cookie=${cookie}`;

    let requestOptions = {
      json: organization,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    // Update person and get last_update field
    request.post(uri, requestOptions)
      .then((res) => {
        reply = res;
        console.log(reply);
      }, (err) => {
        console.log(`ERROR: ${err}`);
      })
      .then(() => {
        request.post(updatedOrganisationUri, requestOptions)
          .then((res) => {
            let lastUpdate = res.content[0].last_update;
            console.log(`rowid: ${organization.rowid} was last updated: ${lastUpdate}`);

            return lastUpdate;
          }, (err) => {
            console.log(`ERROR: ${err}`);
          });
      });
  }
});
