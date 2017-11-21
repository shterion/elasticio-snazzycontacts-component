"use strict";
const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const is_deleted = 1;
let reply = {};

let cfg = {
  apikey: config.production.apikey,
  email: config.production.email,
  password: config.production.password,
  mp_cookie: ''
};

// Update all users who have same_contactperson
let user = {
  rowid: 180214,
  is_deleted: 0
};

let id = {
  rowid: 180214
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    let apiKey = cfg.apikey;
    let cookie = cfg.mp_cookie;
    // let uri = `http://snazzycontacts.com/mp_contact/json_respond/address_contactperson/json_update?mp_cookie=${cookie}`;
    let uri = `http://localhost/mp_contact/json_respond/address_contactperson/json_delete?mp_cookie=${cookie}`;


    let requestOptions = {
      json: id,
      headers: {
        'X-API-KEY': apiKey
      }
    };

    console.log(requestOptions.json);

    request.post(uri, requestOptions)
      .then((res) => {
        // reply = res.content;
        console.log(res);
      }, (err) => {
        console.log(`ERROR: ${err}`);
      });
  }
});
