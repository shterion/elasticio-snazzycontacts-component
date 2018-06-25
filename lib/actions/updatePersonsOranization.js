const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

const { createSession } = require('./../utils/snazzy');

let user = {
  name: 'Doe',
  firstname: 'John',
  for_rowid: 200158,
  same_contactperson: 9364
};

async function updatePersonsOrganization(cookie) {
  let reply = [];
  const options = {
    uri: `${cfg.path}/mp_contact/json_respond/address_contactperson/json_insert?mp_cookie=${cookie}`,
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

(async function () {
  try {
    const cookie = await createSession(cfg);
    updatePersonsOrganization(cookie)
      .then((res) => {
        console.log(`User with ROWID: ${res.rowid} has been updated!`);
        return res;
      }).catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
}());

// snazzy.createSession(cfg, () => {
//   if (cfg.mp_cookie) {
//
//     const {apikey} = cfg;
//     const {mp_cookie: cookie} = cfg;
//     const {path} = cfg;
//     let reply = {};
//
//     const options = {
//       uri: `${path}/mp_contact/json_respond/address_contactperson/json_insert?mp_cookie=${cookie}`,
//       json: user,
//       headers: {
//         'X-API-KEY': apikey
//       }
//     };
//
//     request.post( options)
//       .then((res) => {
//         reply = res.content;
//         console.log(res.same_contactperson);
//         // console.log(JSON.stringify(res, undefined, 2));
//       }, (err) => {
//         console.log(`ERROR: ${err}`);
//       });
//
//     // request.get(sameContactUri, requestOptions)
//     //   .then((res) => {
//     //     let result = JSON.parse(res);
//     //     // console.log(JSON.stringify(res, undefined, 2));
//     //     console.log(result.rowid);
//     //   });
//   }
// });
