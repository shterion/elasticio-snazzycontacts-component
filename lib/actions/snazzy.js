const request = require('request-promise');

function createSession(config, continueOnSuccess) {
  const apiKey = config.apikey;
  const email = config.email;
  const password = config.password;
  const path = config.path;
  console.log(`API KEY: ${apiKey}`);

  const getTokenOptions = {
    uri: `${path}/mp_base/json_login/login/get_token`,
    headers: {
      'X-API-KEY': apiKey
    }
  };

  request.post(getTokenOptions)
    .then((res) => {
      const data = JSON.parse(res);
      const token = data.content.token;
      const options = {
        uri: `${path}/mp_base/json_login/login/verify_credentials`,
        json: {
          token,
          email,
          password
        },
        headers: {
          'X-API-KEY': apiKey
        }
      };

      request.post(options)
        .then((res) => {
          config.mp_cookie = res.content.mp_cookie;
          console.log(`Cookie: ${config.mp_cookie}`);
          continueOnSuccess();
        }).catch((e) => {
          console.log(`ERROR: ${e}`);
        });
      console.log('Token:' + token);
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });
}
module.exports = {
  createSession
};
