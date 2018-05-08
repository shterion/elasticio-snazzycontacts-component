"use strict";
const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

const is_deleted = 1;
let reply = {};

let organization = {
  rowid: 200146,
  is_deleted
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    const {apikey} = cfg;
    const {mp_cookie: cookie} = cfg;
    const {path} = cfg;

    const options = {
      uri: `${path}/mp_contact/json_respond/address_company/json_update?mp_cookie=${cookie}`,
      json: organization,
      headers: {
        'X-API-KEY': apikey
      }
    };

    request.post(options)
      .then((res) => {
        // reply = res.content;
        console.log(res);
      }, (err) => {
        console.log(`ERROR: ${err}`);
      });
  }
});
