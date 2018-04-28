"use strict";
const Q = require('q');
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const snazzy = require('./snazzy.js');
const BASE_URI = `https://snazzycontacts.com/mp_contact/json_respond`;

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

  // Create a session in snazzycontacts and then make a post request to create a new person in snazzycontacts
  snazzy.createSession(cfg, () => {
    if (cfg.mp_cookie) {

      let apiKey = cfg.apikey;
      let cookie = cfg.mp_cookie;
      let existingRowid = 0;

      function checkForExistingUser() {

        return new Promise((resolve, reject) => {
          let uri = `${BASE_URI}/address_contactperson/json_mainview?&mp_cookie=${cookie}`;
          let requestOptions = {
            json: true,
            headers: {
              'X-API-KEY': apiKey
            }
          };

          request.get(uri, requestOptions)
            .then((res) => {
              res.content.forEach((person) => {
                if (msg.body.name == person.name && msg.body.firstname == person.firstname) {
                  existingRowid = person.rowid;
                  msg.body.rowid = existingRowid;
                  console.log(`Person already exists ... ROWID: ${existingRowid}`);
                }
              });

              // if (existingRowid == 0) {
              //   console.log('Creating a person ...');
              // } else {
              //   msg.body.rowid = existingRowid;
              //   console.log(`existingRowid: ${existingRowid}`);
              //   console.log('Updating a person ...');
              // }

              resolve(existingRowid);
            }).catch((e) => {
              reject(e);
            })
        });
      }

      function createPerson() {

        return new Promise((resolve, reject) => {
          let options = {
            json: msg.body,
            headers: {
              'X-API-KEY': apiKey
            }
          };

          if (existingRowid > 0) {
            let uri = `${BASE_URI}/address_contactperson/json_update?mp_cookie=${cookie}`;

            request.post(uri, options)
              .then((res) => {
                reply.push(res);
                console.log('Updating a person ...');
                resolve(reply);
              }).catch((e) => {
                reject(e);
              })
          } else {
            getSameContactId()
              .then((res) => {
                let uri = `${BASE_URI}/address_contactperson/json_insert?&mp_cookie=${cookie}`;
                msg.body.same_contactperson = res;
                request.post(uri, options)
                  .then((res) => {
                    reply.push(res);
                    console.log('Creating a person ...');
                    resolve(reply);
                  }).catch((e) => {
                    reject(e);
                  })
              }).catch((e) => {
                emitError(e);
              });
          }
        });
      }

      function getSameContactId() {
        return new Promise((resolve, reject) => {
          let sameContactUri = `${BASE_URI}/same_contactperson/json_insert?&mp_cookie=${cookie}`;
          request(sameContactUri, {
            headers: {
              'X-API-KEY': apiKey
            }
          }, (err, res, body) => {
            if (err) {
              reject(err);
              return;
            }

            let jsonDecode = JSON.parse(body);
            let sameContactId = jsonDecode.rowid;
            console.log(`sameContactId: ${sameContactId}`);
            resolve(sameContactId);
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
