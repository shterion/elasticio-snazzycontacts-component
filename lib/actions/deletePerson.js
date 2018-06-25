"use strict";
const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();
const { createSession } = require('./../utils/snazzy');

let user = {
  rowid: 201302
};

async function deletePerson(cookie) {
  let reply = [];
  user.is_deleted = 1;
  const options = {
    uri: `${cfg.path}/mp_contact/json_respond/address_contactperson/json_update?mp_cookie=${cookie}`,
    json: user,
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };
  try {
    const deletedPerson = await request.post(options);
    return deletedPerson;
  } catch (e) {
    throw new Error(`No user with ROWID: ${user.rowid} found!`);
  }
}

(async function() {
  try {
    const cookie = await createSession(cfg);
    deletePerson(cookie)
    .then((res) => {
      console.log(`User with ROWID: ${res.rowid} has been deleted!`);
      return res;
    }).catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
})();
