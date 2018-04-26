const request = require('request-promise');

const snazzy = require('./snazzy.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

let organization = {
  name: 'OOPY2'
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
          organization.rowid = existingRowid;
          uri = `${path}/mp_contact/json_respond/address_company/json_update?mp_cookie=${cookie}`;
          console.log(`existingRowid: ${existingRowid}`);
          console.log('Updating an organization ...');
        }
      }).then(() => {
        if (existingRowid > 0) {
          request.post(uri, requestOptions)
            .then((res) => {
              reply = res;
              console.log(`UPDATED ORGANIZATION: ${JSON.stringify(res, undefined, 2)}`);
            }).catch((e) => {
              console.log(`ERROR: ${e}`);
            });
        } else {
          request.post(uri, requestOptions)
            .then((res) => {
              reply = res;
              console.log(reply);
              // console.log(`CREATED ORGANIZATION: ${JSON.stringify(res, undefined, 2)}`);
            }).catch((e) => {
              console.log(`ERROR: ${e}`);
            });
        }
      }).catch((e) => {
        console.log(`ERROR: ${e}`);
      });

  }
});
