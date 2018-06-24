"use strict";
const config = require('./config/config');
const cfg = config.getEnvironment();
const { getToken, getCookie, createSession } = require('./lib/utils/snazzy');

async function verifyCredentials(credentials, cb) {
  console.log('Credentials passed for verification %j', credentials);

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

    if (session) {
      cb(null, { verified: true });
      // console.log('Credentials verified successfully');
      return true;
    }
    throw new Error('Error in validating credentials!');
    return false;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }

}
verifyCredentials(cfg, () => {
  console.log('Credentials verified successfully');
}).catch((e) => {
  console.log(`ERROR: ${e}`);
  throw new Error(e);
});

module.exports = { verifyCredentials };
