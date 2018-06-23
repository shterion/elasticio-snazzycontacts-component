"use strict";
const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();
const { createSession } = require('./../utils/snazzy');

let organization = {
  rowid: 200156
};

async function deleteOrganization(cookie) {
  let reply = [];
  organization.is_deleted = 1;
  const options = {
    uri: `${cfg.path}/mp_contact/json_respond/address_company/json_update?mp_cookie=${cookie}`,
    json: organization,
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };
  try {
    const deletedOrganization = await request.post(options);
    return deletedOrganization;
  } catch (e) {
    throw new Error(`No organization with ROWID: ${organization.rowid} found`);
  }
}

(async function() {
  try {
    const cookie = await createSession(cfg);
    deleteOrganization(cookie)
    .then((res) => {
      console.log(`Organization with ${res.rowid} has been deleted!`);
      return res;
    })
    .catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
})();
