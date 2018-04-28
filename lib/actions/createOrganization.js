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

  // Create a session in snazzycontacts and then make a post request to create a new organization in snazzycontacts
  snazzy.createSession(cfg, () => {
    if (cfg.mp_cookie) {

      let apiKey = cfg.apikey;
      let cookie = cfg.mp_cookie;
      let existingRowid = 0;

      function checkForExistingOrganization() {

        return new Promise((resolve, reject) => {
          let uri = `${BASE_URI}/address_company/json_mainview?&mp_cookie=${cookie}`;
          let requestOptions = {
            json: true,
            headers: {
              'X-API-KEY': apiKey
            }
          };

            request.get(uri, requestOptions)
              .then((res) => {
                res.content.forEach((currentOrganization) => {
                  if (msg.body.name == currentOrganization.name) {
                    existingRowid = currentOrganization.rowid;
                    msg.body.rowid = existingRowid;
                    console.log(`Organization alreday exists ... ROWID: ${existingRowid}`);
                  }
                });
                resolve(existingRowid);
              }).catch((e) => {
                reject(e);
              })
        });
      }

      function createOrganization() {
        console.log(`eixisting rowid ${existingRowid}`);

        return new Promise((resolve, reject) => {
          let options = {
            json: msg.body,
            headers: {
              'X-API-KEY': apiKey
            }
          };

          if (existingRowid > 0) {
            let uri = `${BASE_URI}/address_company/json_update?mp_cookie=${cookie}`;
            request.post(uri, options)
              .then((res) => {
                reply.push(res);
                console.log('Updating an organization ...');
                resolve(reply);
              }).catch((e) => {
                reject(e);
              })
          } else {
            let uri = `${BASE_URI}/address_company/json_insert?mp_cookie=${cookie}`;
            request.post(uri, options)
              .then((res) => {
                reply.push(res);
                console.log('Creating an organization ...');
                resolve(reply);
              }).catch((e) => {
                reject(e);
              });
          }
        });
      }

      function emitData() {
        let data = messages.newMessageWithBody({
          "organization": reply
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
      .then(checkForExistingOrganization)
      .then(createOrganization)
      .then(emitData)
      .fail(emitError)
      .done(emitEnd);

    }
  });
}
