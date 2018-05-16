const request = require('request-promise');
const snazzy = require('./snazzy');
const config = require('./../../config/config');
const cfg = config.getEnvironment();


let organization = {
  name: 'COMPANY Ltd'
};

snazzy.createSession(cfg, () => {
  if (cfg.mp_cookie) {

    const {apikey: apiKey} = cfg;
    const {mp_cookie: cookie} = cfg;
    const {path} = cfg;
    let reply = {};
    let existingRowid = 0;

    // let updatedUserUri = `${path}/mp_contact/json_respond/address_contactperson/json_detailview?mp_cookie=${cookie}`;

    let options = {
      uri: `${path}/mp_contact/json_respond/address_company/json_insert?&mp_cookie=${cookie}`,
      json: organization,
      headers: {
        'X-API-KEY': apiKey
      }
    };

    function checkForExistingOrganization() {
      const options = {
        uri: `${path}/mp_contact/json_respond/address_company/json_mainview?&mp_cookie=${cookie}`,
        json: {
          "address_company_name": msg.body.name
        },
        headers: {
          'X-API-KEY': apiKey
        }
      };

      return new Promise((resolve, reject) => {
        request.get(options)
          .then((res) => {
            if (res.content[0].rowid) {
              existingRowid = res.content[0].rowid;
              console.log(`Organization already exists ... ROWID: ${existingRowid}`);
            }
            // res.content.forEach((currentOrganization) => {
            //   if (organization.name == currentOrganization.name) {
            //     existingRowid = currentOrganization.rowid;
            //     console.log(`Organization alreday exists ... ROWID: ${existingRowid}`);
            //   }
            // });
            resolve(existingRowid);
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
          request.post(options)
            .then((res) => {
              reply = res;
              console.log(`UPDATED ORGANIZATION: ${JSON.stringify(res, undefined, 2)}`);
            }).catch((e) => {
              console.log(`ERROR: ${e}`);
            });
        } else {
          request.post(options)
            .then((res) => {
              reply = res;
              console.log(reply);
            }).catch((e) => {
              console.log(`ERROR: ${e}`);
            });
        }
      }).catch((e) => {
        console.log(`ERROR: ${e}`);
      });
  }
});
