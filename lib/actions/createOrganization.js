const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

let organization = {
  name: 'MY COMPANY'
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    let apiKey = cfg.apikey;
    let cookie = cfg.mp_cookie;
    let path = cfg.path;
    let existingRowid = 0;

    let uri = `${path}/mp_contact/json_respond/address_company/json_insert?&mp_cookie=${cookie}`;
    // let updatedUserUri = `${path}/mp_contact/json_respond/address_contactperson/json_detailview?mp_cookie=${cookie}`;

    let requestOptions = {
      json: organization,
      headers: {
        'X-API-KEY': apiKey
      }
    };

    function checkForExistingOrganization() {
      let uri = `${path}/mp_contact/json_respond/address_company/json_mainview?&mp_cookie=${cookie}`;
      let requestOptions = {
        json: {
          max_hits: 100,
          print_address_data_only: 1
        },
        headers: {
          'X-API-KEY': apiKey
        }
      };

      return new Promise((resolve, reject) => {
        request.get(uri, requestOptions)
          .then((res) => {
            res.content.forEach((currentOrganization) => {
              if (organization.name == currentOrganization.name) {
                existingRowid = currentOrganization.rowid;
                console.log(`Organization alreday exists ... ROWID: ${existingRowid}`);
              }
            });
            resolve(true);
          }).catch((e) => {
            reject(e);
          })
      });
    };

    checkForExistingOrganization()
      .then((res) => {
        if (existingRowid == 0) {
          uri = `${path}/mp_contact/json_respond/address_company/json_insert?&mp_cookie=${cookie}`;
          console.log('Creating an organization ...');
        } else {
          user.rowid = existingRowid;
          uri = `${path}/mp_contact/json_respond/address_company/json_detailview?mp_cookie=${cookie}`;
          console.log(`existingRowid: ${existingRowid}`);
          console.log('Updating an organization ...');
        }
      })

  }
});
