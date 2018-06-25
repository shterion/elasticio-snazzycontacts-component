"use strict";
const request = require('request-promise');
const moment = require('moment');
const config = require('./../../config/config');
const cfg = config.getEnvironment();
const { createSession } = require('./../utils/snazzy');


// Update an organization
let organization = {
  rowid: 200129,
  name: 'Testing Ltd.'
};

async function updateOrganization(cookie) {
  let reply = [];
  const options = {
    uri: `${cfg.path}/mp_contact/json_respond/address_company/json_update?mp_cookie=${cookie}`,
    json: organization,
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };

  try {
    const updatedOrganization = await request.post(options);
    console.log(`UPDATED ORGANIZATION: ${JSON.stringify(updatedOrganization, undefined, 2)}`);
    return updatedOrganization;
  } catch (e) {
    throw new Error(`No organization with ROWID: ${organization.rowid} found!`);
  }
}

(async function () {
  try {
    const cookie = await createSession(cfg);
    updateOrganization(cookie)
      .then((res) => {
        console.log(`Organization with ROWID: ${res.rowid} has been updated!`);
        return res;
      }).catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
}());

// snazzy.createSession(cfg, () => {
//   if (cfg.mp_cookie) {
//     let reply = {};
//
//     const { mp_cookie: cookie } = cfg;
//     const { path } = cfg;
//
//     const updatedOrganisationUri = `${path}/mp_contact/json_respond/address_company/json_detailview?mp_cookie=${cookie}`;
//
//     const options = {
//       uri: `${path}/mp_contact/json_respond/address_company/json_update?mp_cookie=${cookie}`,
//       json: organization,
//       headers: {
//         'X-API-KEY': cfg.apikey
//       }
//     };
//
//     request.post(options)
//       .then((res) => {
//         reply = res;
//         console.log(reply);
//       }, (err) => {
//         console.log(`ERROR: ${err}`);
//       })
//       .then(() => {
//         request.post(updatedOrganisationUri, options)
//           .then((res) => {
//             let lastUpdate = res.content[0].last_update;
//             console.log(`rowid: ${organization.rowid} was last updated: ${lastUpdate}`);
//             return lastUpdate;
//           }, (err) => {
//             console.log(`ERROR: ${err}`);
//           });
//       });
//   }
// });
