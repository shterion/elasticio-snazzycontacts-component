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
const snazzy = require('./../actions/snazzy');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

snazzy.createSession(cfg, async () => {
  let customOrganizationFormat;
  let result = [];
  const requestOptions = {
    uri: `${cfg.path}/mp_contact/json_respond/address_company/json_mainview?mp_cookie=${cfg.mp_cookie}`,
    json: {
      'print_deleted_entries_only': true
    },
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };

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
      console.log(JSON.stringify(result.length, undefined, 2));
      return result;
    }).catch((e) => {
      console.log(e);
    })
});
