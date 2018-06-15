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
const { createSession } = require('./../utils/snazzy');

async function getOrganizations(options) {
  try {
    let result = [];
    const organizations = await request.post(options);
    organizations.content.forEach((organization) => {
      // const currentOrganization = customOrganization(organization);
      //TODO: Custom orgnaization format
      result.push(organization);
    });
    console.log(JSON.stringify(result.length, undefined, 2));
    return result;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
};

(async function () {
  try {
    const cookie = await createSession(cfg);
    const requestOptions = {
      uri: `${cfg.path}/mp_contact/json_respond/address_company/json_mainview?&mp_cookie=${cookie}`,
      json: {
        'max_hits': 100 // just for testing purposes
      },
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };
    getOrganizations(requestOptions);
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
})();

module.exports = {
  createSession,
  getOrganizations
};
