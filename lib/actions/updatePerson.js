"use strict";
const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();
const { createSession } = require('./../utils/snazzy');

// Update an user
let user = {
  rowid: 201301,
  name: 'Stones',
  firstname: 'Renat'
  // for_rowid: 199943,
  // same_contactperson: 247,
  // same_contactperson_top: 1
};

async function updatePerson(cookie) {
  let reply = [];
  const options = {
    uri: `${cfg.path}/mp_contact/json_respond/address_contactperson/json_update?mp_cookie=${cookie}`,
    json: user,
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };

  try {
    const updatedPerson = await request.post(options);
    console.log(`UPDATED PERSON: ${JSON.stringify(updatedPerson, undefined, 2)}`);
    return updatedPerson;
  } catch (e) {
    throw new Error(`No user with ROWID: ${user.rowid} found!`);
  }
}

(async function() {
  try {
    const cookie = await createSession(cfg);
    updatePerson(cookie)
      .then((res) => {
        console.log(`User with ROWID: ${res.rowid} has been updated!`);
        return res;
      }).catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
})();


// snazzy.createSession(cfg, () => {
//   if (cfg.mp_cookie) {
//
//     const { mp_cookie: cookie } = cfg;
//     const { path } = cfg;
//
//     const updatedUserUri = `${path}/mp_contact/json_respond/address_contactperson/json_detailview?mp_cookie=${cookie}`;
//
//     const options = {
//       uri: `${path}/mp_contact/json_respond/address_contactperson/json_update?mp_cookie=${cookie}`,
//       json: user,
//       headers: {
//         'X-API-KEY': cfg.apikey
//       }
//     };
//
//     request.post(options)
//       .then((res) => {
//         console.log(`UPDATED PERSON: ${JSON.stringify(res, undefined, 2)}`);
//         reply = res;
//       }, (err) => {
//         console.log(`ERROR: ${err}`);
//       }).then(() => {
//         request.post(updatedUserUri, options)
//           .then((res) => {
//             // reply = res;
//             let sameContactId = res.content[0].same_contactperson;
//             console.log(`rowid: ${user.rowid} has same_contactperson: ${sameContactId}`);
//             // console.log(reply);
//             // return lastUpdate;
//           }, (err) => {
//             console.log(`ERROR: ${err}`);
//           });
//       });
//   }
// });
