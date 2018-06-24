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

const headers = {
  'X-API-KEY': cfg.apikey
};

let input = {
  name: 'MHQ Ltd'
};

async function checkForExistingOrganization(organization, cookie) {
  try {
    let existingRowid = 0;
    const requestOptions = {
      uri: `${cfg.path}/mp_contact/json_respond/address_company/json_mainview?&mp_cookie=${cookie}`,
      json: {
        "address_company_name": input.name
      },
      headers
    };
    const getExistingRowid = await request.post(requestOptions);
    if (getExistingRowid.content[0].rowid) {
      existingRowid = getExistingRowid.content[0].rowid;
      console.log(`Organization already exists ... ROWID: ${existingRowid}`);
    }
    return existingRowid;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
}

async function createOrUpdateOrganization(existingRowid, cookie) {
  try {
    const requestOptions = {
      json: input,
      headers
    };
    if (existingRowid == 0) {
      console.log('Creating organization ...');
      requestOptions.uri = `${cfg.path}/mp_contact/json_respond/address_company/json_insert?&mp_cookie=${cookie}`;
      const organization = await request.post(requestOptions);
      console.log(JSON.stringify(organization, undefined, 2));
      return organization;
    } else {
      console.log('Updating organization ... ');
      requestOptions.uri = `${cfg.path}/mp_contact/json_respond/address_company/json_update?mp_cookie=${cookie}`;
      input.rowid = existingRowid;
      const organization = await request.post(requestOptions);
      console.log(JSON.stringify(organization, undefined, 2));
      return organization;
    }
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
}

(async function () {
  try {
    const cookie = await createSession(cfg);
    const existingRowid = await checkForExistingOrganization(input, cookie);
    createOrUpdateOrganization(existingRowid, cookie);
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
})();
