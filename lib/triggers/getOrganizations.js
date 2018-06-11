/**
 * Copyright 2018 Wice GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();
const { session } = require('./../utils/cookie');

<<<<<<< HEAD
snazzy.createSession(cfg, async () => {
  let customOrganizationFormat;
  let result = [];
  const requestOptions = {
    uri: `${cfg.path}/mp_contact/json_respond/address_company/json_mainview?mp_cookie=${cfg.mp_cookie}`,
    json: true,
=======
async function getOrganizations(options) {
  let result = [];
  try {
    const organizations = await request.post(options);
    organizations.content.forEach((organization) => {
      // const currentPerson = customPerson(organization);
      result.push(organization);
    });
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }
  // console.log(JSON.stringify(result[0].name, undefined, 2));
  return result;
};

session(cfg).then((cookie) => {
  const options = {
    uri: `${cfg.path}/mp_contact/json_respond/address_company/json_mainview?&mp_cookie=${cookie}`,
    json: {
      'max_hits': 100
    },
>>>>>>> 878d1624eb754f0f1ce0b0be102b0ffb0aca5a0d
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };
<<<<<<< HEAD

  request.post(requestOptions)
    .then((res) => {
      res.content.forEach((organization) => {
        customOrganizationFormat = {
          rowid: organization.rowid,
          name: organization.name,
          is_deleted: organization.is_deleted
        };
        result.push(customOrganizationFormat);
      });
      console.log(JSON.stringify(res.content[0], undefined, 2));
      return result;
    }).catch((e) => {
      console.log(e);
    })
=======
  getOrganizations(options);
>>>>>>> 878d1624eb754f0f1ce0b0be102b0ffb0aca5a0d
});

module.exports = {
  session,
  getOrganizations
};
