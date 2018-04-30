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

  const requestOptions = {
    uri: `${cfg.path}/mp_contact/json_respond/address_company/json_mainview?mp_cookie=${cfg.mp_cookie}`,
    json: true,
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };
  //
  // try {
  //   const organizations = await request.post(uri, requestOptions);
  //   // console.log(JSON.stringify(organizations.content, undefined, 2));
  //   console.log(organizations.content.length);
  // } catch (e) {
  //   console.log(`ERROR: ${e}`);
  // }

  request.post(requestOptions)
    .then((res) => {
      // console.log(JSON.stringify(res.content, undefined, 2));
      console.log(res.content.length);
    }).catch((e) => {
      console.log(e);
    })
});
