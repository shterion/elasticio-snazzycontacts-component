"use strict";
const Q = require('q');
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const snazzy = require('../actions/snazzy.js');

exports.process = processTrigger;

function processTrigger(msg, cfg) {

  let contacts = [];
  let self = this;

  snazzy.createSession(cfg, () => {

    let apiKey = cfg.apikey;
    let cookie = cfg.mp_cookie;

    function getPersons() {

      return new Promise((resolve, reject) => {
        let uri = `https://snazzycontacts.com/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`;
        let requestOptions = {
          json: true,
          // {
          //   max_hits: 100,
          //   print_address_data_only: 1
          // },
          headers: {
            'X-API-KEY': apiKey
          }
        };

        request.get(uri, requestOptions)
        .then((res) => {
          contacts = res.content;
          resolve(contacts)
        }).catch((e) => {
          reject(e);
        });
      });
    }

    function emitData() {
      let data = messages.newMessageWithBody({
        "persons": contacts
      });
      self.emit('data', data);
    }

    function emitError(e) {
      console.log(`ERROR: ${e}`);
      self.emit('error', e);
    }

    function emitEnd() {
      console.log('Finished execution');
      self.emit('end');
    }

    Q()
    .then(getPersons)
    .then(emitData)
    .fail(emitError)
    .done(emitEnd);

  });
}
