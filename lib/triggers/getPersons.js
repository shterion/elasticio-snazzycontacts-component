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
const snazzy = require('./../actions/snazzy.js');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

snazzy.createSession(cfg, async () => {
  const {apikey: apiKey} = cfg;
  const {mp_cookie: cookie} = cfg;
  const {path} = cfg;
  // let persons = [];

  const options = {
    uri: `${path}/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`,
    json: true,
    headers: {
      'X-API-KEY': apiKey
    }
  };

  try {
    const persons = await request.post(options);
    console.log(persons.content[0].for_rowid);
    // console.log(JSON.stringify(persons.content, undefined, 2));
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }
});
