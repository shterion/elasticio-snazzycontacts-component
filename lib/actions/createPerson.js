// Production Version

"use strict";
const Q = require('q');
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const wice = require('./wice.js');

exports.process = processAction;

/**
 *  This method will be called from elastic.io platform providing following data
 *
 * @param msg
 * @param cfg
 */
function processAction(msg, cfg) {

  let reply = [];
  let self = this;
  msg.body.same_contactperson = 'auto';

  // First create a session in Wice
  wice.createSession(cfg, () => {
    if (cfg.cookie) {

      let person = JSON.stringify(msg.body);
      let existingRowid = 0;

      let options = {
        method: 'POST',
        uri: 'https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json',
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };

      // Check it the person alredy exists
      function checkForExistingUser() {
        options.form = {
          method: 'get_all_persons',
          cookie: cfg.cookie,
          ext_search_do: 1,
          name: msg.body.name // Best practice is to use email but at this point of time the email is not accesible
        };

        return new Promise((resolve, reject) => {
          request.post(options).then((res) => {
            let resObj = JSON.parse(res);

            if (resObj.loop_addresses) {
              existingRowid = resObj.loop_addresses[0].rowid;
              console.log(`Person alredy exists ... ROWID: ${existingRowid}`);
            }
            console.log(existingRowid);
            resolve(existingRowid);
          }).catch((e) => {
            reject(e);
          })
        });
      };

      function createPerson() {

        return new Promise((resolve, reject) => {
            if (existingRowid > 0) {
              msg.body.rowid = existingRowid;
              options.form = {
                method: 'update_contact',
                cookie: cfg.cookie,
                data: person
              };
              console.log('Updating a person ...');
            } else {
              options.form = {
                method: 'insert_contact',
                cookie: cfg.cookie,
                data: person
              };
              console.log('Creating a person ...');
            }

            request.post(options).then((res) => {
              let obj = JSON.parse(res);
              reply.push(obj);
              resolve(reply);
            }).catch((e) => {
              reject(e);
            });
        });
      }

      // Emit data from promise depending on the result
      function emitData() {
        let data = messages.newMessageWithBody({
          "person": reply
        });
        self.emit('data', data);
      }

      function emitError(e) {
        console.log('Oops! Error occurred');
        self.emit('error', e);
      }

      function emitEnd() {
        console.log('Finished execution');
        self.emit('end');
      }

      Q()
      .then(checkForExistingUser)
      .then(createPerson)
      .then(emitData)
      .fail(emitError)
      .done(emitEnd);
    }
  });
}

// Dev Version

// const request = require('request-promise');
//
// const snazzy = require('./snazzy.js');
// const config = require('./../../config/config');
//
// const cfg = config.getEnvironment();
//
// let reply = {};
//
// let user = {
//   name: 'Hobbsss1',
//   firstname: 'Jackk'
//   // for_rowid: 199978
// };
//
// snazzy.createSession(cfg, () => {
//   let apiKey = cfg.apikey;
//   let cookie = cfg.mp_cookie;
//   let path = cfg.path;
//   let existingRowid = 0;
//
//   let uri = `${path}/mp_contact/json_respond/address_contactperson/json_insert?&mp_cookie=${cookie}`;
//   let sameContactUri = `${path}/mp_contact/json_respond/same_contactperson/json_insert?&mp_cookie=${cookie}`;
//   // let updatedUserUri = `${path}/mp_contact/json_respond/address_contactperson/json_detailview?mp_cookie=${cookie}`;
//
//   let requestOptions = {
//     json: user,
//     headers: {
//       'X-API-KEY': apiKey
//     }
//   };
//
//   function checkForExistingUser() {
//     let uri = `https://snazzycontacts.com/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`;
//     let requestOptions = {
//       json: {
//         max_hits: 100,
//         print_address_data_only: 1
//       },
//       headers: {
//         'X-API-KEY': apiKey
//       }
//     };
//
//     return new Promise((resolve, reject) => {
//       request.get(uri, requestOptions)
//         .then((res) => {
//           res.content.forEach((person) => {
//             if (user.name == person.name && user.firstname == person.firstname) {
//               existingRowid = person.rowid;
//               console.log(`Person already exists ... ROWID: ${existingRowid}`);
//             }
//           })
//           resolve(true);
//         }).catch((e) => {
//           reject(e);
//         })
//     });
//   };
//
//   function getSameContactId() {
//     return new Promise((resolve, reject) => {
//       request(sameContactUri, {
//         headers: {
//           'X-API-KEY': apiKey
//         }
//       }, (err, res, body) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//
//         let jsonDecode = JSON.parse(body);
//         let sameContactId = jsonDecode.rowid;
//         console.log(`sameContactId: ${sameContactId}`);
//         resolve(sameContactId);
//       });
//     });
//   }
//
//   checkForExistingUser()
//     .then((res) => {
//       if (existingRowid == 0) {
//         uri = `${path}/mp_contact/json_respond/address_contactperson/json_insert?&mp_cookie=${cookie}`;
//         console.log('Creating a person ...');
//       } else {
//         user.rowid = existingRowid;
//         uri = `${path}/mp_contact/json_respond/address_contactperson/json_update?mp_cookie=${cookie}`;
//         console.log(`existingRowid: ${existingRowid}`);
//         console.log('Updating a person ...');
//       }
//     }).then(() => {
//       if (existingRowid > 0) {
//         request.post(uri, requestOptions)
//           .then((res) => {
//             console.log(typeof res);
//             reply = res;
//             console.log(`UPDATED PERSON: ${JSON.stringify(res, undefined, 2)}`);
//           })
//           // .then(() => {
//           //   request.post(updatedUserUri, requestOptions)
//           //     .then((res) => {
//           //       // reply = res;
//           //       let sameContactId = res.content[0].same_contactperson;
//           //       console.log(sameContactId);
//           //     })
//           // })
//           .catch((e) => {
//             console.log(`ERROR: ${e}`);
//           });
//       } else {
//         getSameContactId()
//           .then((res) => {
//             user.same_contactperson = res;
//             request.post(uri, requestOptions)
//               .then((res) => {
//                 reply = res;
//                 console.log(reply);
//               }).catch((e) => {
//                 console.log(`ERROR: ${e}`);
//               });
//           })
//       }
//     }).catch((e) => {
//       console.log(`ERROR: ${e}`);
//     });
// });
