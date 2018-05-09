"use strict";
const request = require('request-promise');
const moment = require('moment');
const snazzy = require('./snazzy');
const config = require('./../../config/config');
const cfg = config.getEnvironment();


// Update an organization
let organization = {
  rowid: 200148,
  name: 'Company Ltd.'
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {
    let reply = {};

    const { mp_cookie: cookie } = cfg;
    const { path } = cfg;

    const updatedOrganisationUri = `${path}/mp_contact/json_respond/address_company/json_detailview?mp_cookie=${cookie}`;

    const options = {
      uri: `${path}/mp_contact/json_respond/address_company/json_update?mp_cookie=${cookie}`,
      json: organization,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    request.post(options)
      .then((res) => {
        reply = res;
        console.log(reply);
      }, (err) => {
        console.log(`ERROR: ${err}`);
      })
      .then(() => {
        request.post(updatedOrganisationUri, options)
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
