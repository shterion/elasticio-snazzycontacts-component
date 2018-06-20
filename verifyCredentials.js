"use strict";
const config = require('./config/config');
const cfg = config.getEnvironment();
const { getToken, getCookie, createSession } = require('./lib/utils/snazzy');

async function verifyCredentials(credentials, cb) {
  console.log('Credentials passed for verification %j', credentials)

  try {
    const cfg = {
      apikey: credentials.apikey,
      email: credentials.email,
      password: credentials.password,
      path: credentials.path
    };
    const token = await getToken(cfg);
    const cookie = await getCookie(token, cfg);
    const session = await createSession(cfg);

    cb(null, { verified: true });
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }

  // if (!credentials.email) {
  //   console.log('Invalid email');
  //   return cb(null, {
  //     verified: false
  //   });
  // }
  //
  // if (!credentials.apikey) {
  //   console.log('Invalid API key');
  //   return cb(null, { verified: false });
  // }
  //
  // console.log('Credentials verified successfully');
  //
  // cb(null, { verified: true });
}
verifyCredentials(cfg, () => {
  console.log('Credentials verified successfully');
});

module.exports = {verifyCredentials};
