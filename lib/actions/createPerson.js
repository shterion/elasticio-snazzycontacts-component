const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();
const { session } = require('./../utils/cookie');

let user = {
  name: 'Doe',
  firstname: 'John'
  // for_rowid: 199978
};

async function checkForExistingUser(cookie) {
  let existingRowid = 0;
  const requestOptions = {
    uri: `${cfg.path}/mp_contact/json_respond/address_contactperson/json_mainview?&mp_cookie=${cookie}`,
    json: {
      "address_contactperson_name": user.name,
      "address_contactperson_firstname": user.firstname
    },
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };
  const getExistingRowid = await request.post(requestOptions);
  if (getExistingRowid.content[0].rowid) {
    existingRowid = getExistingRowid.content[0].rowid;
    console.log(`Person already exists... ROWID: ${existingRowid}`);
  }
  return existingRowid;
}

async function getSameContactId(cookie) {
  const requestOptions = {
    uri: `${cfg.path}/mp_contact/json_respond/same_contactperson/json_insert?&mp_cookie=${cookie}`,
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };
  const getId = await request.post(requestOptions);
  const jsonDecode = JSON.parse(getId);
  let sameContactId = jsonDecode.rowid;
  return sameContactId;
}

async function createOrUpdatePerson(existingRowid, cookie) {
  const requestOptions = {
    json: user,
    headers: {
      'X-API-KEY': cfg.apikey
    }
  };
  if (existingRowid == 0) {
    console.log('Creating person ...');
    requestOptions.uri = `${cfg.path}/mp_contact/json_respond/address_contactperson/json_insert?&mp_cookie=${cookie}`;
    const sameContactId = await getSameContactId(cookie);
    user.same_contactperson = sameContactId;
    const person = await request.post(requestOptions);
    console.log(JSON.stringify(person, undefined, 2));
  } else {
    console.log('Updating a person ...');
    requestOptions.uri = `${cfg.path}/mp_contact/json_respond/address_contactperson/json_update?&mp_cookie=${cookie}`;
    user.rowid = existingRowid;
    const person = await request.post(requestOptions);
  }
}

session(cfg).then((cookie) => {
  checkForExistingUser(cookie).then((existingRowid) => {
    createOrUpdatePerson(existingRowid, cookie);
  });
});

module.exports = {
  checkForExistingUser,
  getSameContactId,
  createOrUpdatePerson
};
