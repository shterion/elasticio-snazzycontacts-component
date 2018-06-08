const request = require('request-promise');

async function createSession(config, continueOnSuccess) {
  const {apikey} = config;
  const {email} = config;
  const {password} = config;
  const {path} = config;
  console.log(`API KEY: ${apikey}`);

  async function getToken() {
    const getTokenOptions = {
      uri: `${path}/mp_base/json_login/login/get_token`,
      headers: {
        'X-API-KEY': apikey
      }
    };

    const tokenRequest = await request.post(getTokenOptions);
    const tokenObject = JSON.parse(tokenRequest);
    const { token } = tokenObject.content;
    console.log(`Token: ${token}`);
    return token;
  }

  async function getCookie(token) {
    const options = {
      uri: `${path}/mp_base/json_login/login/verify_credentials`,
      json: {
        token,
        email,
        password
      },
      headers: {
        'X-API-KEY': apikey
      }
    };
    const cookie = await request.post(options);
    config.mp_cookie = cookie.content.mp_cookie;
    console.log(`Cookie: ${config.mp_cookie}`);
  }

  const token = await getToken();
  const cookie = await getCookie(token);
  continueOnSuccess();
}

module.exports = {
  createSession
};
