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
  name: 'Bellucci',
  firstname: 'Monica'
  // for_rowid: 199978
};

async function checkForExistingUser(user, cookie) {
  try {
    let existingRowid = 0;
    const requestOptions = {
      uri: `${cfg.path}/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`,
      json: {
        // Best practise is to use email for to check user identity,
        // but for testing purposes we use first name and last name
        "address_contactperson_name": user.name,
        "address_contactperson_firstname": user.firstname
      },
      headers
    };
    const getExistingRowid = await request.post(requestOptions);
    if (getExistingRowid.content[0].rowid) {
      existingRowid = getExistingRowid.content[0].rowid;
      console.log(`Person already exists... ROWID: ${existingRowid}`);
    }
    return existingRowid;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
}

async function getSameContactId(cookie) {
  try {
    const requestOptions = {
      uri: `${cfg.path}/mp_contact/json_respond/same_contactperson/json_insert?&mp_cookie=${cookie}`,
      headers
    };
    const getId = await request.post(requestOptions);
    const jsonDecode = JSON.parse(getId);
    let sameContactId = jsonDecode.rowid;
    return sameContactId;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
}

async function createOrUpdatePerson(existingRowid, cookie) {
  try {
    const requestOptions = {
      json: input,
      headers
    };
    if (existingRowid == 0) {
      console.log('Creating person ...');
      requestOptions.uri = `${cfg.path}/mp_contact/json_respond/address_contactperson/json_insert?&mp_cookie=${cookie}`;
      const sameContactId = await getSameContactId(cookie);
      input.same_contactperson = sameContactId;
      const person = await request.post(requestOptions);
      console.log(JSON.stringify(person, undefined, 2));
      return person;
    } else {
      console.log('Updating person ...');
      requestOptions.uri = `${cfg.path}/mp_contact/json_respond/address_contactperson/json_update?&mp_cookie=${cookie}`;
      input.rowid = existingRowid;
      const person = await request.post(requestOptions);
      console.log(JSON.stringify(person, undefined, 2));
      return person;
    }
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
}

(async function () {
  try {
    const cookie = await createSession(cfg);
    const existingRowid = await checkForExistingUser(input, cookie);
    createOrUpdatePerson(existingRowid, cookie);
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
})();

module.exports = {
  checkForExistingUser,
  getSameContactId,
  createOrUpdatePerson
};
