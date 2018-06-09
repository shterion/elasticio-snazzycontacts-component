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
  console.log(JSON.stringify(result.length, undefined, 2));
  return result;
};

session(cfg).then((cookie) => {
  const options = {
    uri: `${cfg.path}/mp_contact/json_respond/address_company/json_mainview?&mp_cookie=${cookie}`,
    json: {
      'max_hits': 100
    },
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };
  getOrganizations(options);
});

module.exports = {
  getOrganizations
};
