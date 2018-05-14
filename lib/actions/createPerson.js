
"use strict";
const Q = require('q');
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const snazzy = require('./snazzy');
const BASE_URI = `https://snazzycontacts.com/mp_contact/json_respond`;

exports.process = processAction;

/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 */
function processAction(msg, cfg) {

  snazzy.createSession(cfg, () => {
    if (cfg.mp_cookie) {

      const self = this;
      const { apikey } = cfg;
      const { mp_cookie: cookie } = cfg;
      let existingRowid = 0;
      let reply = [];

      function checkForExistingUser() {
        return new Promise((resolve, reject) => {
          const requestOptions = {
            uri: `${BASE_URI}/address_contactperson/json_mainview?&mp_cookie=${cookie}`,
            json: {
              "address_contactperson_name": msg.body.name,
              "address_contactperson_firstname": msg.body.firstname
            },
            headers: {
              'X-API-KEY': apikey
            }
          };

          request.post(requestOptions)
            .then((res) => {
              res.content.forEach((person) => {
                  existingRowid = person.rowid;
                  msg.body.rowid = existingRowid;
                  console.log(`Person already exists ... ROWID: ${person.rowid} with first name ${person.firstname} and last name ${person.name}`);
              });
              resolve(existingRowid);
            }).catch((e) => {
              reject(e);
            })
        });
      }

      function createPerson() {
        return new Promise((resolve, reject) => {
          const options = {
            json: msg.body,
            headers: {
              'X-API-KEY': apikey
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
                const uri = `${BASE_URI}/address_contactperson/json_insert?&mp_cookie=${cookie}`;
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
          const sameContactUri = `${BASE_URI}/same_contactperson/json_insert?&mp_cookie=${cookie}`;
          request(sameContactUri, {
            headers: {
              'X-API-KEY': apikey
            }
          }, (err, res, body) => {
            if (err) {
              reject(err);
            }
            const jsonDecode = JSON.parse(body);
            const sameContactId = jsonDecode.rowid;
            console.log(`sameContactId: ${sameContactId}`);
            resolve(sameContactId);
          });
        });
      }

      function emitData() {
        const data = messages.newMessageWithBody({
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
