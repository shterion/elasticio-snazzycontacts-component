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
let snapshot;

async function getPersons(options, snapshot = {}) {

  snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();
  console.log(`Last Updated: ${snapshot.lastUpdated}`);

  try {
    const persons = await request.post(options);
    const totalEntries = persons.content[0].total_entries_readable_with_current_permissions;

    if (totalEntries == 0) {
      throw new Error('No persons found ...');
    }

    let result = [];
    persons.content.filter((person) => {
      const currentPerson = customPerson(person);
      currentPerson.last_update > snapshot.lastUpdated && result.push(currentPerson);
    });

    result.sort((a, b) => Date.parse(a.last_update) - Date.parse(b.last_update));
    if (result.length > 1) {
      snapshot.lastUpdated= result[result.length - 1].last_update;
      console.log(`New snapshot: ${snapshot.lastUpdated}`);
    }

    return result;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
}

function customPerson(person) {
  const customUserFormat = {
    rowid: person.rowid,
    firstname: person.firstname,
    name: person.name,
    email: person.email,
    for_rowid: person.for_rowid,
    same_contactperson: person.same_contactperson,
    last_update: person.last_update,
    is_deleted: person.is_deleted,
    title: person.title,
    salutation: person.salutation,
    date_of_birth: person.date_of_birth,
    private_street: person.private_street,
    private_zip_code: person.private_zip_code,
    private_town: person.private_town,
    private_country: person.private_country,
    house_post_code: person.house_post_code,
    fax: person.fax,
    phone: person.phone,
    mobile_phone: person.mobile_phone,
    private_mobile_phone: person.private_mobile_phone,
    private_phone: person.private_phone,
    private_email: person.private_email,
    facebook_url: person.facebook_url,
    linked_in_url: person.linked_in_url,
    twitter_url: person.twitter_url,
    googleplus_url: person.googleplus_url,
    youtube_url: person.youtube_url,
    url: person.url,
    skype: person.skype
  };
  return customUserFormat;
}

(async function () {
  try {
    const cookie = await createSession(cfg);
    const requestOptions = {
      uri: `${cfg.path}/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`,
      json: { 'max_hits': 100 },
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    // Snapshot
    snapshot = {
      lastUpdated: '2018-06-11 09:00:00'
    };

    getPersons(requestOptions, snapshot)
    .then((res) => {
      console.log(`PERSONS LENGTH: ${res.length}`);
      // console.log(res[res.length - 1]);
      return res;
    })
    .catch((e) => console.log(e));
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
})();

module.exports = {
  createSession,
  getPersons
};
