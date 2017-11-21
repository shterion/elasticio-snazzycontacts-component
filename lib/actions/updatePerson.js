"use strict";
const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = {
  apikey: config.production.apikey,
  email: config.production.email,
  password: config.production.password,
  path: config.production.path,
  mp_cookie: ''
};

let reply = {};

// Update all users who have the same same_contactperson
let user = {
  rowid: 197411,
  name: 'Dowey'
  // firstname: 'Patrik',
  // for_rowid: 199943,
  // same_contactperson: 247,
  // same_contactperson_top: 1
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

    // request.post(uri, requestOptions, (error, response, body) => {
    //   if (!error && response.statusCode == 200) {
    //     reply = body;
    //     // console.log(JSON.stringify(reply, undefined, 2));
    //     emitData();
    //   }
    // });

    request.post(uri, requestOptions)
      .then((res) => {
        reply = res.content;
      }, (err) => {
        console.log(`ERROR: ${err}`);
      });
  }
});
