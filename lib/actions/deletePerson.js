"use strict";
const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

const is_deleted = 1;
let reply = {};

let user = {
  rowid: 180214,
  is_deleted
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    let apiKey = cfg.apikey;
    let cookie = cfg.mp_cookie;
    let path = cfg.path;

    let uri = `${path}/mp_contact/json_respond/address_contactperson/json_update?mp_cookie=${cookie}`;

    let requestOptions = {
      json: user,
      headers: {
        'X-API-KEY': apiKey
      }
    };

    request.post(uri, requestOptions)
      .then((res) => {
        // reply = res.content;
        console.log(res);
      }, (err) => {
        console.log(`ERROR: ${err}`);
      });
  }
});
